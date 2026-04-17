import AnnouncementsCalendar from "@/components/announcements/announcementsCalendar";
import { faBackward, faForward, faPaperPlane, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMonth, getYear, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AnnouncementTile(props: { announcementData: AnnouncementDataType; refetchAnnouncements: Function }) {
	const [publishButtonText, setPublishButtonText] = useState(props.announcementData.published ? "Ukryj post" : "Opublikuj post");
	const [content, setContent] = useState<string>(props.announcementData.content);
	const [deleteButtonText, setDeleteButtonText] = useState("Usuń komunikat");
	const [editButtonText, setEditButtonText] = useState("Edytuj komunikat");
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [month, setMonth] = useState<number>(getMonth(startOfToday()));
	const [year, setYear] = useState<number>(getYear(startOfToday()));
	const [selectedDays, setSelectedDays] = useState<string[]>([...props.announcementData.days.map((day) => day.date)]);
	const [status, setStatus] = useState(props.announcementData.published);
	const [editedStatus, setEditedStatus] = useState(false);

	async function deleteNotification() {
		setDeleteButtonText("Usuwanie...");

		const data = new FormData();
		data.set("id", props.announcementData.id);

		await (
			await fetch(`/api/dashboard/announcement/`, {
				body: data,
				method: "DELETE",
			})
		).json();

		await props.refetchAnnouncements();
		setDeleteButtonText("Usuń komunikat");
	}
	async function toggleAnnouncement() {
		setPublishButtonText("Ładowanie...");

		const newStatus = await (await fetch(`/api/dashboard/announcement/publish/${props.announcementData.id}?toggle=${!status}`)).json();

		setStatus(newStatus);
		setPublishButtonText(newStatus ? "Ukryj post" : "Opublikuj post");
		setEditedStatus(true);
	}
	async function update() {
		setEditButtonText("Edytowanie...");
		const data = new FormData();
		data.set("id", props.announcementData.id);
		data.set("content", content);

		for (const date of selectedDays) {
			data.append("dates[]", date);
		}

		try {
			const res = await fetch("/api/dashboard/announcement/", {
				method: "PUT",
				body: data,
			});

			if (!res.ok) {
				setEditButtonText("Wystąpił błąd");
				return;
			}

			setIsEditing(false);
			setEditButtonText("Edytuj komunikat");
		} catch {
			setEditButtonText("Wystąpił błąd");
		}
	}

	const { data: session } = useSession();
	const user = session?.user as JustUserDataType;

	const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
	let date = new Date(props.announcementData.createdAt);
	const dateToDisplay = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

	const monthsNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

	function changeMonth(up: boolean) {
		if (up) {
			if (month == 11) {
				setMonth(0);
				setYear((old) => old + 1);
			} else setMonth((old) => old + 1);
		} else {
			if (month == 0) {
				setMonth(11);
				setYear((old) => old - 1);
			} else setMonth((old) => old - 1);
		}
	}

	return (
		<div
			className={`adminPostTile h-fit w-full text-left flex-col xl:flex-row xl:items-center border-2 hover:bg-LightGray/40 transition-all duration-300 py-5 md:py-6 md:px-8 px-5 lg:py-8 lg:px-8 3xl:px-12 xl:py-9 flex gap-y-4 md:gap-y-6 lg:gap-y-10 xl:gap-x-14 3xl:gap-x-16 rounded-2xl ${
				isEditing ? "bg-LightGray/40 scale-[1.02]" : ""
			}`}
		>
			<div className="flex flex-col gap-y-2 xl:gap-y-5 lg:gap-y-3.5 w-full">
				{!isEditing ? (
					<div
						className={`text-2xs whitespace-pre-wrap 2xl:text-base text-MainDarkGray/50 2xs:text-xs xs:text-sm 3xl:line-clamp-[7] 4xl:line-clamp-[8] line-clamp-6 poppinsFont400`}
					>
						{content}
					</div>
				) : (
					<textarea
						onChange={(e) => setContent(e.target.value)}
						value={content}
						id="content"
						className="h-fit rounded-lg outline-none bg-white p-2 text-2xs 2xl:text-base 2xs:text-xs xs:text-sm"
						placeholder="Podaj treść informacji"
						rows={8}
					/>
				)}
			</div>

			{!isEditing && (
				<div className={`flex flex-col md:justify-between grow lg:gap-y-5 2xl:gap-y-7 xl:gap-y-9 md:gap-x-5 gap-y-2 plusJakartaSans500`}>
					<div className="dashboardPostTileDataRow">
						<p className="h-fit">Publiczny: </p>
						<div className={`dashboardPostTileData flex items-center gap-x-2 plusJakartaSans700`}>
							<div className={`w-2 h-2 rounded-full ${status ? "bg-MainColor" : "bg-SecondColor"}`} />
							{status ? "Opublikowany" : "Nie opublikowany"}
						</div>
					</div>
					<div className="dashboardPostTileDataRow">
						<p className="h-fit">Utworzony: </p>
						<div className={`dashboardPostTileData plusJakartaSans700`}>{dateToDisplay}</div>
					</div>
					<div className="dashboardPostTileDataRow">
						<p className="h-fit">Autor: </p>
						<div className={`dashboardPostTileData plusJakartaSans700`}>{props.announcementData.author.name}</div>
					</div>
					<div className="dashboardPostTileDataRow">
						<p className="h-fit">{status ? "Opublikowany przez: " : "Ukryty przez: "}</p>
						<div className={`dashboardPostTileData plusJakartaSans700`}>{editedStatus ? user.name : (props.announcementData.publishedBy?.name ?? "---")}</div>{" "}
					</div>
				</div>
			)}

			{isEditing && (
				<div className="flex flex-col items-center grow gap-y-4 min-w-max">
					<div className="flex items-center justify-between w-full">
						<FontAwesomeIcon icon={faBackward} className="text-MainDarkGray/80 hover:text-MainColor transition-all" onClick={() => changeMonth(false)} />
						<h1 className={`sm:text-lg md:text-xl text-center lg:text-2xl poppinsFont500`}>{monthsNames[month]}</h1>
						<FontAwesomeIcon icon={faForward} className="text-MainDarkGray/80 hover:text-MainColor transition-all" onClick={() => changeMonth(true)} />
					</div>
					<AnnouncementsCalendar month={month} year={year} setSelectedDays={(e: string[]) => setSelectedDays(e)} selectedDays={selectedDays} />
				</div>
			)}

			<div className="flex sm:grid sm:grid-cols-2 md:flex justify-between xl:justify-normal gap-y-2 2xl:gap-y-3 flex-col md:flex-row xl:flex-col gap-x-5">
				<button
					onClick={() => {
						if (isEditing) update();
						else {
							setIsEditing((old) => !old);
							setEditButtonText("Potwierdź edycje");
						}
					}}
					className={`group/button dashboard-post-tile plusJakartaSans700`}
				>
					{editButtonText}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={isEditing ? faPaperPlane : faPen} />
					</div>
				</button>

				<button onClick={() => toggleAnnouncement()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					{publishButtonText}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={faPaperPlane} />
					</div>
				</button>

				<button onClick={() => deleteNotification()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					{deleteButtonText}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={faTrash} />
					</div>
				</button>
			</div>
		</div>
	);
}
