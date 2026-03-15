import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ExpandingDay(props: { expandedDayData: DayDataType; expandedDay: string; hideExpanded: Function; setTag: Function }) {
	const monthsNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
	const router = useRouter();

	return (
		<motion.div
			layoutId={props.expandedDay}
			className={`flex flex-col gap-y-4 xs:gap-y-5 md:gap-y-6 w-full lg:gap-y-8 max-w-xs md:max-w-md lg:max-w-2xl 3xl:max-w-5xl 4xl:max-w-6xl items-start fixed bg-white rounded-3xl z-30 p-3 xs:p-5 sm:p-6 xs:gap-5 md:p-10`}
			key={parseInt(props.expandedDay)}
		>
			<motion.div className="flex justify-between gap-x-4 sm:gap-x-5 lg:gap-x-6 xl:gap-x-7 items-center w-full">
				<motion.div
					className={`xl:px-3 xl:py-1.5 py-1 3xl:p-4 p-2 text-center rounded-full text-xs sm:text-sm lg:text-base xl:text-lg 3xl:text-xl plusJakartaSans800 ${
						props.expandedDayData.freeDay ? "bg-[#44D375]/20 text-[#1fd15e]" : "bg-LightColor text-SecondColor"
					}`}
				>
					{props.expandedDayData.day} {monthsNames[props.expandedDayData.month]} {props.expandedDayData.year}
				</motion.div>

				<motion.div
					className={`flex justify-center items-center gap-x-1.5 md:gap-x-3 text-2xs md:text-xs lg:text-sm xl:text-base 3xl:text-xl text-MainDarkGray ${
						(props.expandedDayData.freeDay || !props.expandedDayData.number) && "hidden"
					} poppinsFont500`}
				>
					Numerek:
					<motion.div
						className={`outline-[3px] lg:outline-4 outline-LightColor me-0.5 lg:me-1 outline bg-LightColor/40 text-center w-[19px] md:w-6 lg:w-7 xl:w-9 3xl:w-10 4xl:w-11 h-fit p-0.5 md:p-1 xl:p-1.5 4xl:p-2 rounded-full plusJakartaSans800`}
					>
						{props.expandedDayData.number}
					</motion.div>
				</motion.div>
			</motion.div>

			{props.expandedDayData.events.length != 0 && (
				<motion.div className="flex w-full flex-col gap-y-2 md:gap-y-4 xl:gap-y-5 items-start">
					<motion.p
						className={`text-md lg:text-lg xl:text-xl 3xl:text-2xl text-MainDarkGray 
						 plusJakartaSans800`}
					>
						Wydarzenia:
					</motion.p>
					<motion.div className="grid gap-2 grid-cols-1 3xl:grid-cols-2 w-full">
						{props.expandedDayData.events.map((event) => (
							<motion.div
								key={event.id}
								className={`w-full flex flex-col gap-y-1 md:gap-y-1.5 lg:gap-y-2 event-container transition-all duration-300 bg-LightColor py-2 px-3 md:px-4 md:py-3 xl:px-6 xl:py-2.5 text-white rounded-xl 2xl:rounded-2xl`}
							>
								<div className="flex items-center justify-between grow">
									<div className={`text-sm lg:text-base xl:text-lg 3xl:text-xl text-MainDarkGray poppinsFont500`}>{event.name}</div>

									{event.post && (
										<FontAwesomeIcon
											icon={faLink}
											onClick={() => router.push("/post/" + event.post?.id)}
											className="bg-MainColor cursor-pointer hover:bg-SecondColor transition-all text-white rounded-full aspect-square p-1.5 ms-7"
										/>
									)}
								</div>
								<div className="flex items-center gap-x-2 sm:gap-x-3 hide-scrollbar overflow-x-auto w-full">
									{event.tags.map((tag) => (
										<div
											onClick={() => {
												props.setTag(tag.id);
												props.hideExpanded();
											}}
											key={tag.id}
											className={`flex cursor-pointer h-fit rounded-3xl py-1 gap-x-2 px-2 sm:px-3 items-center transition-color duration-300 bg-white`}
										>
											<div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-color duration-300`} style={{ backgroundColor: tag.color }} />
											<p className={`text-2xs whitespace-nowrap md:text-xs 2xl:text-sm transition-color duration-300 text-MainDarkGray poppinsFont500`}>
												{tag.name}
											</p>
										</div>
									))}
								</div>

								{event.description && <div className={`text-xs lg:text-sm text-SecondColor xl:text-base 3xl:text-lg poppinsFont400`}>{event.description}</div>}
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			)}
		</motion.div>
	);
}
