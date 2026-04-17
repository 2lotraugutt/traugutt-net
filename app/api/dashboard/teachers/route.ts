import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const session = (await getServerSession(authOptions)) as SessionDataType | undefined;

	if (session) {
		if (session.user.role.manageTeachers) {
			const data = await request.formData();
			const title = (data.get("title") as string) || null;
			const email = (data.get("email") as string) || null;
			const description = (data.get("description") as string) || null;
			const className = (data.get("class") as string) || null;
			const image = ((data.get("image") as string) || "").trim();
			const name = ((data.get("name") as string) || "").trim();
			const lastName = ((data.get("lastName") as string) || "").trim();
			const subjects: string = (data.get("subjects") as string) || "[]";

			if (!name || !lastName) {
				return NextResponse.json({ error: "Name and last name are required" }, { status: 400 });
			}
			await prisma.teacher.create({
				data: {
					title,
					name,
					lastName,
					email,
					description,
					image: image || "/teacherDefault.png",
					class: className,
					subjects: JSON.parse(subjects),
				},
			});

			return NextResponse.json({ success: true });
		} else return NextResponse.json({ error: "You are not allowed to do this. Permissions exceeded" }, { status: 500 });
	} else return NextResponse.json({ error: "You are not logged in" }, { status: 500 });
}

export async function DELETE(request: NextRequest) {
	const session = (await getServerSession(authOptions)) as SessionDataType | undefined;

	if (session) {
		if (session.user.role.manageTeachers) {
			const data = await request.formData();

			const id: string = data.get("id") as string;

			await prisma.teacher.delete({ where: { id } });

			return NextResponse.json({ success: true });
		} else return NextResponse.json({ error: "You are not allowed to do this. Permissions exceeded" }, { status: 500 });
	} else return NextResponse.json({ error: "You are not logged in" }, { status: 500 });
}

export async function PUT(request: NextRequest) {
	const session = (await getServerSession(authOptions)) as SessionDataType | undefined;

	if (session) {
		if (session.user.role.manageTeachers) {
			const data = await request.formData();
			const id: string = data.get("id") as string;
			const title = (data.get("title") as string) || null;
			const email = (data.get("email") as string) || null;
			const description = (data.get("description") as string) || null;
			const className = (data.get("class") as string) || null;
			const image = ((data.get("image") as string) || "").trim();
			const name = ((data.get("name") as string) || "").trim();
			const lastName = ((data.get("lastName") as string) || "").trim();
			const subjects: string = (data.get("subjects") as string) || "[]";

			if (!name || !lastName) {
				return NextResponse.json({ error: "Name and last name are required" }, { status: 400 });
			}
			await prisma.teacher.update({
				where: { id },
				data: {
					title,
					name,
					lastName,
					email,
					description,
					image: image || "/teacherDefault.png",
					class: className,
					subjects: JSON.parse(subjects),
				},
			});

			return NextResponse.json({ success: true });
		} else return NextResponse.json({ error: "You are not allowed to do this. Permissions exceeded" }, { status: 500 });
	} else return NextResponse.json({ error: "You are not logged in" }, { status: 500 });
}
