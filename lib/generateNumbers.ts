import prisma from "@/lib/prisma";
import { format, getDate, getMonth, getYear, nextDay, startOfToday } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import fs from "fs";
import path from "path";

type RangeType = 1 | 2 | 3 | 4 | 5;

const dataFilePath = path.join(process.cwd(), "lucky_numbers.json");

let leftNumbers: number[] = Array.from({ length: 35 }, (v, k) => k + 1);

try {
	const data = fs.readFileSync(dataFilePath, "utf8");
	leftNumbers = JSON.parse(data);
} catch (error) {
	console.error("Error reading data file:", error);
}

async function GenerateNumbers() {
	for (let i = 0; i < 5; i++) {
		if (leftNumbers.length == 0) leftNumbers = Array.from({ length: 35 }, (v, k) => k + 1);

		const dayNumber = (i + 1) as RangeType;

		const randomNumber = Math.floor(Math.random() * leftNumbers.length);
		const generatedNumber = leftNumbers.slice(randomNumber, randomNumber + 1)[0];

		const dayDate = zonedTimeToUtc(nextDay(startOfToday(), dayNumber), "UTC");
		const formattedDate = format(dayDate, "dd-MM-yyyy");

		try {
			await prisma.day.upsert({
				where: { date: formattedDate, freeDay: false },
				update: { number: generatedNumber },
				create: {
					timeStamp: dayDate,
					date: formattedDate,
					number: generatedNumber,
					day: getDate(dayDate),
					month: getMonth(dayDate),
					year: getYear(dayDate),
				},
			});
			leftNumbers.splice(randomNumber, 1);
		} catch {}
	}
	fs.writeFileSync(dataFilePath, JSON.stringify(leftNumbers), "utf8");
}

// cron.schedule("0 0 * * 6", () => {
// 	GenerateNumbers();
// });
