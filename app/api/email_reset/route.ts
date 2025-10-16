import prisma from "@/lib/prisma";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);
export async function POST(request: NextRequest) {
	const data = await request.formData();

	const login: string = data.get("login") as string;
	const scriptPath = path.join(process.cwd(), "lib/return_email.sh");

	const { stdout, stderr } = await execPromise(`${scriptPath} ${login}`);

	if (stderr) return NextResponse.json({ error: stderr }, { status: 500 });

	await prisma.resetToken.create({
		data: {
			email: stdout.trim(),
			login,
		},
	});

	await prisma.resetToken.deleteMany({
		where: {
			createdAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
		},
	});
	return NextResponse.json({ success: true, email: stdout });
}

export async function PUT(request: NextRequest) {
	const data = await request.formData();

	const token: string = data.get("token") as string;
	const newPass: string = data.get("newPass") as string;

	const resetToken = await prisma.resetToken.findFirst({
		where: { token, createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) } },
	});

	if (!resetToken) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

	await prisma.resetToken.deleteMany({
		where: {
			OR: [
				{ login: resetToken.login },
				{
					createdAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
				},
			],
		},
	});

	const scriptPath = path.join(process.cwd(), "lib/reset_password.sh");
	const { stdout, stderr } = await execPromise(`${scriptPath} ${resetToken.login} ${newPass}`);

	if (stderr) return NextResponse.json({ error: stderr }, { status: 500 });

	return NextResponse.json({ success: true });
}
