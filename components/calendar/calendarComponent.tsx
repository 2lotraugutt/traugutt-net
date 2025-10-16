import { endOfMonth, getDate, getDaysInMonth, getISODay, startOfMonth } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import DatabaseTile from "./databaseTile";
import DayTile from "./dayTile";
import ExpandingDay from "./expandingDay";

export default function CalendarComponent(props: { today: Date; month: number; year: number; setTag: Function }) {
	const [days, setDays] = useState<DayDataType[]>([]);
	const [fetched, setFetched] = useState<boolean>(false);

	const [expandedDay, setExpandedDay] = useState<string>();
	const [expandedDayData, setExpandedDayData] = useState<DayDataType>();

	const monthBegining = startOfMonth(props.today);
	const monthEnding = endOfMonth(props.today);
	const firstDayOfMonth = getISODay(monthBegining) - 1;

	const monthLenght = getDaysInMonth(props.today);
	const prevMonthLastDay = getDate(endOfMonth(new Date(props.year, props.month - 1, 1)));
	const nextMonthDaysCount = 7 - getISODay(monthEnding);

	useEffect(() => {
		fetchPost();
		async function fetchPost() {
			setFetched(false);
			const days = await (await fetch(`api/calendar/days?month=${props.month}&year=${props.year}`)).json();

			setDays(days);
			setFetched(true);
		}
	}, [props.month, props.year]);

	function setExpDay(dayDate: string) {
		setExpandedDay(dayDate);

		const filteredDays = days.filter((day) => day.date == dayDate);
		const day = filteredDays.length == 0 ? undefined : filteredDays[0];

		if (day) setExpandedDayData(day);
		else {
			const day = parseInt(dayDate.slice(0, 2));
			const month = parseInt(dayDate.slice(3, 5)) - 1;
			const year = parseInt(dayDate.slice(6, 10));
			setExpandedDayData({
				day: day,
				year: year,
				month: month,
				timeStamp: zonedTimeToUtc(new Date(year, month, day), "UTC"),
				date: dayDate,
				events: [],
				freeDay: false,
				number: null,
				announcements: [],
			});
		}
	}

	if (fetched)
		return (
			<>
				<div className="grid grid-cols-7 w-full gap-2 sm:gap-3.5 xl:gap-6 3xl:gap-10">
					{[...Array(firstDayOfMonth)].map((e, i) => {
						const dayNumber = prevMonthLastDay + (i - firstDayOfMonth + 1);
						const date = new Date(props.year, props.month - 1, dayNumber);

						return <DayTile differentMonth={true} date={date} key={date.toString()} setExpDay={setExpDay} />;
					})}
					{[...Array(monthLenght)].map((e, i) => {
						const dayNumber = i + 1;
						const filteredDays = days.filter((day) => day.day == dayNumber);
						const day = filteredDays.length == 0 ? undefined : filteredDays[0];

						if (day) return <DatabaseTile day={day} key={day.date} setExpDay={setExpDay} />;
						else {
							const date = new Date(props.year, props.month, dayNumber);
							return <DayTile setExpDay={setExpDay} differentMonth={false} date={date} key={date.toString()} />;
						}
					})}
					{[...Array(nextMonthDaysCount)].map((e, i) => {
						const dayNumber = i + 1;
						const date = new Date(props.year, props.month + 1, dayNumber);

						return <DayTile differentMonth={true} date={date} key={date.toString()} setExpDay={setExpDay} />;
					})}
				</div>

				<AnimatePresence>
					{expandedDay && expandedDayData && (
						<motion.div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-20">
							<ExpandingDay expandedDay={expandedDay} expandedDayData={expandedDayData} hideExpanded={() => setExpandedDay(undefined)} setTag={props.setTag} />
							<div className="w-screen h-screen fixed top-0 left-0 z-20 bg-Gray/30" onClick={() => setExpandedDay(undefined)}></div>
						</motion.div>
					)}
				</AnimatePresence>
			</>
		);
	else
		return (
			<div className="grid grid-cols-7 w-full gap-2 sm:gap-3.5 xl:gap-6 3xl:gap-10">
				{[...Array(35)].map((e, i) => {
					return (
						<div key={i} className={`day-tile animate-pulse ${i % 7 == 6 || i % 7 == 5 ? "bg-MediumGray/70" : "bg-MediumGray/40"}`}>
							<div className={`day-number aspect-square bg-LightGray`}></div>
						</div>
					);
				})}
			</div>
		);
}
