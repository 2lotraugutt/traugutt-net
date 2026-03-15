import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
	faAngleRight,
	faClipboardList,
	faFile,
	faFileWord,
	faGlobe,
	faGraduationCap,
	faHome,
	faHouseUser,
	faNewspaper,
	faPhone,
	faPiggyBank,
	faSchool,
	faTableList,
	faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function SidebarNavigation(props: { toggle: Function }) {
	const [openedList, setOpened] = useState<boolean[]>([]);
	const [routes, setRoutes] = useState<RouteDataType[]>();

	function changeState(i: number) {
		let newOpened = [...mainNavs.map(() => false)];

		newOpened[i] = !openedList[i];
		setOpened(newOpened);
	}

	function closeNavbar() {
		props.toggle();
		setOpened([]);
	}

	useEffect(() => {
		fetchRoutes();
		async function fetchRoutes() {
			const fetchedRoutes = await (await fetch("/api/routes")).json();

			setRoutes(fetchedRoutes);
		}
	}, []);

	const mainNavs: { name: string; icon: IconDefinition; routes: string }[] = [
		{
			name: "Szkoła",
			icon: faSchool,
			routes: "school",
		},
		{
			name: "Dla ucznia",
			icon: faGraduationCap,
			routes: "student",
		},
		{
			name: "Dla rodziców",
			icon: faHouseUser,
			routes: "parents",
		},
		{
			name: "Rekrutacja",
			icon: faClipboardList,
			routes: "recruitation",
		},
		{
			name: "Matura",
			icon: faFileWord,
			routes: "exam",
		},
		{
			name: "Gazetka LOT",
			icon: faNewspaper,
			routes: "lot",
		},
		{
			name: "Wyprawy",
			icon: faGlobe,
			routes: "trips",
		},
		{
			name: "Dokumenty",
			icon: faFile,
			routes: "docs",
		},
	];

	return (
		<>
			<div className="h-1 bg-DarkColor/40 rounded-lg"></div>

			<div className="flex flex-col gap-y-1">
				<Link href={"https://uonetplus.vulcan.net.pl/czestochowa"} onClick={() => closeNavbar()} target="blank" className="sidebar-button">
					<FontAwesomeIcon icon={faTableList} className="w-6 h-6 text-white py-3 px-4" />
					<div className={`poppinsFont600`}>Dziennik elektroniczny</div>
				</Link>
				<Link href={"https://fundacja2lotraugutt.pl/"} target="blank" onClick={() => closeNavbar()} className="sidebar-button">
					<FontAwesomeIcon icon={faPiggyBank} className="w-6 h-6 text-white py-3 px-4" />
					<div className={`poppinsFont600`}>Fundacja Szkolna Traugutta</div>
				</Link>
				<Link href={"https://m.facebook.com/groups/421406146993216/?ref=share"} target="blank" onClick={() => closeNavbar()} className="sidebar-button">
					<FontAwesomeIcon icon={faUserGraduate} className="w-6 h-6 text-white py-3 px-4" />
					<div className={`poppinsFont600`}>Grupa absolwentów</div>
				</Link>

				<div className="flex gap-x-1 justify-between px-1.5 mt-2">
					<Link
						aria-label="Instagram link"
						href={"https://www.instagram.com/2lotraugutt/"}
						target="blank"
						className="aspect-square flex transition-all duration-300 items-center hover:bg-MainDarkGray/30 rounded-xl text-white p-2.5"
					>
						<FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-white aspect-square" />
					</Link>
					<Link
						aria-label="Facebook link"
						href={"https://www.facebook.com/trauguttnet"}
						target="blank"
						className="aspect-square flex transition-all duration-300 items-center hover:bg-MainDarkGray/30 rounded-xl text-white p-2.5"
					>
						<FontAwesomeIcon icon={faFacebook} className="w-6 h-6 text-white aspect-square" />
					</Link>
					<Link
						aria-label="TikTok link"
						href={"https://www.tiktok.com/@traugutt_czestochowa"}
						target="blank"
						className="aspect-square flex transition-all duration-300 items-center hover:bg-MainDarkGray/30 rounded-xl text-white p-2.5"
					>
						<FontAwesomeIcon icon={faTiktok} className="w-6 h-6 text-white aspect-square" />
					</Link>
					<Link
						aria-label="Youtube link"
						href={"https://www.youtube.com/@IILOTraugutt"}
						target="blank"
						className="aspect-square flex transition-all duration-300 items-center hover:bg-MainDarkGray/30 rounded-xl text-white p-2.5"
					>
						<FontAwesomeIcon icon={faYoutube} className="w-6 h-6 text-white aspect-square" />
					</Link>
				</div>
			</div>

			<div className="h-1 bg-DarkColor/40 rounded-lg"></div>

			<motion.div className="flex flex-col gap-y-1">
				<Link href={"/"} onClick={() => closeNavbar()} className="sidebar-button">
					<FontAwesomeIcon icon={faHome} className="w-6 h-6 text-white py-3 px-4" />
					<div className={`poppinsFont600`}>Strona główna</div>
				</Link>

				{mainNavs.map((nav, i) => {
					const routesForNav = routes?.filter((route) => route.category == nav.routes) ?? [];
					return (
						<React.Fragment key={nav.routes}>
							<motion.button className={`sidebar-button ${openedList[i] && "bg-MainDarkGray/20"} poppinsFont600`} onClick={() => changeState(i)}>
								<FontAwesomeIcon icon={nav.icon} className="w-6 h-6 text-white py-3 px-4" />
								<div>{nav.name}</div>

								{routes && routesForNav.length != 0 && (
									<FontAwesomeIcon
										icon={faAngleRight}
										className={`w-5 h-5 transition-all duration-300 ms-auto text-white px-4 ${openedList[i] && "rotate-90"}`}
									/>
								)}
							</motion.button>

							<AnimatePresence>
								{routes && routesForNav.length != 0 && openedList[i] && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="flex mt-1 overflow-hidden"
									>
										<div className="w-1 bg-MainColor mx-4 my-2.5 py-0.5 rounded-full flex flex-col items-center justify-between">
											{[...Array(routesForNav.length)].map((n, i) => (
												<div key={i} className={`w-3.5 h-3.5 rounded-full bg-MainColor`}></div>
											))}
										</div>
										<div className="flex flex-col gap-y-1 grow">
											{routesForNav.map((route, j) => (
												<Link
													key={j}
													target="_blank"
													onClick={() => closeNavbar()}
													className={`sidebar-button px-3 py-1.5 w-full poppinsFont500`}
													href={route.link}
												>
													{route.name}
												</Link>
											))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</React.Fragment>
					);
				})}
				<Link href={"/kontakt"} className={`sidebar-button poppinsFont600`}>
					<FontAwesomeIcon icon={faPhone} className="w-6 h-6 text-white py-3 px-4" />
					<div>Kontakt</div>
				</Link>
			</motion.div>
		</>
	);
}
