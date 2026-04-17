"use client";

import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMonth, getYear, startOfToday } from "date-fns";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ManyNumbersCalendar from "./manyNumbersCalendar";
import NumbersCalendar from "./numbersCalendar";

export default function Page() {
	const [today, setToday] = useState<Date>(startOfToday());
	const [month, setMonth] = useState<number>(getMonth(startOfToday()));
	const [year, setYear] = useState<number>(getYear(startOfToday()));
	const [startDate, setStartDate] = useState<string | null>(null);
	const [buttonText, setButtonText] = useState<string>("Wylosuj numerki");
	const [endDate, setEndDate] = useState<string | null>(null);
	const currentYear = getYear(startOfToday());
	const [numbers, setNumbers] = useState<{ number: number; date: string }[]>([]);
	const [fetched, setFetched] = useState<boolean>(false);

	function changeMonth(up: boolean) {
		if (up) {
			if (month == 11) {
				setMonth(0);
				setYear((old) => old + 1);
			} else setMonth((old) => old + 1);
			setToday(new Date(year, month + 1, 2));
		} else {
			if (month == 0) {
				setMonth(11);
				setYear((old) => old - 1);
			} else setMonth((old) => old - 1);
			setToday(new Date(year, month - 1, 2));
		}
	}
	const setRange = (start: string | null, end: string | null) => {
		setStartDate(start);
		setEndDate(end);
	};

	const weekDays = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
	const weekDaysShort = ["Pn", "Wt", "Śr", "Czw", "Pt"];
	const monthsNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
	const router = useRouter();

	async function fetchPost() {
		setFetched(false);
		const numbers = await (await fetch(`/api/calendar/getNumbers?month=${month}&year=${year}`)).json();

		setNumbers(numbers);
		setFetched(true);
	}
	async function initFunction() {
		const session = (await getSession()) as SessionDataType | undefined;

		if (session) {
			if (session.user.role.manageNotifications || session.user.role.manageNumbers) {
				fetchPost();
			} else router.push("/dashboard");
		} else router.push("/");
	}

	useEffect(() => {
		initFunction();
	}, [router]);

	async function reFetch() {
		const numbers = await (await fetch(`/api/calendar/getNumbers?month=${month}&year=${year}`)).json();

		setNumbers(numbers);
	}

	async function generateNumbers() {
		const data = new FormData();

		data.set("start_date", startDate!);
		data.set("end_date", endDate!);

		setButtonText("Generowanie...");

		try {
			const res = await fetch("/api/dashboard/numbers/", {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				setButtonText("Wystąpił błąd");
				return;
			}

			setButtonText("Wylosuj numerki");
			setStartDate(null);
			setEndDate(null);
			reFetch();
		} catch {
			setButtonText("Wystąpił błąd");
		}
	}

	return (
		<div className="dashboard-page">
			<h1 className={`dashboard-heading poppinsFont700`}>Szczęśliwe numerki</h1>
			<div className="flex justify-evenly items-center md:items-start md:flex-wrap flex-col md:flex-row gap-x-4 gap-y-8">
				<ManyNumbersCalendar month={month} year={year} startDate={startDate} endDate={endDate} setRange={setRange} />
				<ManyNumbersCalendar
					month={month + 1 > 11 ? month - 11 : month + 1}
					year={month + 1 > 11 ? year + 1 : year}
					startDate={startDate}
					endDate={endDate}
					setRange={setRange}
				/>
				<ManyNumbersCalendar
					month={month + 2 > 11 ? month - 10 : month + 2}
					year={month + 2 > 11 ? year + 1 : year}
					startDate={startDate}
					endDate={endDate}
					setRange={setRange}
				/>
				<button
					disabled={startDate == null && endDate == null ? true : false}
					onClick={() => generateNumbers()}
					className={`w-fit whitespace-nowrap h-fit self-center bg-MainColor hover:bg-MainDarkGray transition-all duration-300 ease-out text-sm md:text-base lg:text-lg px-16 sm:px-20 py-2.5 sm:py-3 text-white rounded-3xl plusJakartaSans800`}
				>
					{buttonText}
				</button>
			</div>
			<div className="mb-2 flex items-center w-full gap-x-4 justify-center lg:justify-start">
				<FontAwesomeIcon icon={faBackward} className="text-MainDarkGray/80 h-5 hover:text-MainColor transition-all" onClick={() => changeMonth(false)} />
				<h3 className={`text-left w-fit text-xl xs:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl poppinsFont600`}>
					{monthsNames[month]} {currentYear != year ? <span className="text-base xs:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">{year}</span> : <></>}
				</h3>
				<FontAwesomeIcon icon={faForward} className="text-MainDarkGray/80 h-5 hover:text-MainColor transition-all" onClick={() => changeMonth(true)} />
			</div>
			<div className="flex gap-2 sm:gap-3.5 xl:gap-6 3xl:gap-10 text-MainDarkGray/60 w-full pb-1 md:pb-1.5 xl:pb-2 3xl:pb-2.5 border-b-2 3xl:border-b-[3px]">
				{weekDays.map((weekDay, i) => (
					<div className={`w-full hidden xs:block text-center lg:text-right px-1 text-xs md:text-sm xl:text-lg 2xl:text-xl 4xl:text-2xl poppinsFont500`} key={i}>
						{weekDay}
					</div>
				))}

				{weekDaysShort.map((weekDay, i) => (
					<div className={`w-full xs:hidden text-sm text-center poppinsFont500`} key={i}>
						{weekDay}
					</div>
				))}
			</div>
			<NumbersCalendar month={month} year={year} today={today} fetched={fetched} numbers={numbers} reFetch={reFetch} />
		</div>
	);
}
