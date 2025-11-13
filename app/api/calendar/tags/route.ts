import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	let tags = await prisma.eventTag.findMany({
		orderBy: [
			{
				events: { _count: "desc" },
			},
		],
	});

	return NextResponse.json(tags);
}
