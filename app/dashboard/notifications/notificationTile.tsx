import { faPaperPlane, faPen, faThumbTack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function NotificationTile(props: { notificationData: NotificationDataType; refetchNotifications: Function }) {
	const [title, setTitle] = useState<string>(props.notificationData.title);
	const [content, setContent] = useState<string>(props.notificationData.content);
	const [deleteButtonText, setDeleteButtonText] = useState("Usuń informację");
	const [editButtonText, setEditButtonText] = useState("Edytuj informację");
	const [pinButtonText, setPinButtonText] = useState(props.notificationData.pinned ? "Odepnij informację" : "Przypnij informację");
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [pinned, setPinned] = useState(props.notificationData.pinned);

	async function togglePin() {
		if (pinned) setPinButtonText("Odpinanie...");
		else setPinButtonText("Przypinanie...");

		const data = new FormData();
		data.set("id", props.notificationData.id);

		await (
			await fetch(`/api/dashboard/notifications/pinNotification?toggle=${!pinned}`, {
				body: data,
				method: "POST",
			})
		).json();

		if (pinned) setPinButtonText("Przypnij");
		else setPinButtonText("Odepnij");
		setPinned((old) => !old);
	}

	async function deleteNotification() {
		setDeleteButtonText("Usuwanie...");

		const data = new FormData();
		data.set("id", props.notificationData.id);

		const notification = await (
			await fetch(`/api/dashboard/notifications/`, {
				body: data,
				method: "DELETE",
			})
		).json();

		await props.refetchNotifications();
		setDeleteButtonText("Usuń informację");
	}

	async function update() {
		setEditButtonText("Edytowanie...");
		const data = new FormData();
		data.set("id", props.notificationData.id);
		data.set("title", title);
		data.set("content", content);

		try {
			const res = await fetch("/api/dashboard/notifications/", {
				method: "PUT",
				body: data,
			});

			if (!res.ok) {
				setEditButtonText("Wystąpił błąd");
				return;
			}

			setIsEditing(false);
			setEditButtonText("Edytuj informację");
		} catch {
			setEditButtonText("Wystąpił błąd");
		}
	}

	const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
	let date = new Date(props.notificationData.createdAt);
	const dateToDisplay = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

	return (
		<div
			className={`adminPostTile h-fit w-full text-left flex-col xl:flex-row xl:items-center border-2 hover:bg-LightGray/40 transition-all duration-300 py-5 md:py-6 md:px-8 px-5 lg:py-8 lg:px-8 3xl:px-12 xl:py-9 flex gap-y-4 md:gap-y-6 lg:gap-y-10 xl:gap-x-14 3xl:gap-x-16 rounded-2xl ${
				isEditing ? "bg-LightGray/40 scale-[1.02]" : ""
			}`}
		>
			<div className="flex flex-col gap-y-2 xl:gap-y-5 lg:gap-y-3.5 w-full">
				{!isEditing ? (
					<p className={`line-clamp-2 md:line-clamp-none text-sm 2xs:text-lg sm:text-xl md:text-2xl 4xl:text-3xl poppinsFont700`}>
						{pinned && <FontAwesomeIcon icon={faThumbTack} />} {title}
					</p>
				) : (
					<input
						placeholder="Podaj tytuł"
						className={`bg-white rounded-lg p-2 -mx-2 outline-none text-sm 2xs:text-lg sm:text-xl md:text-2xl 4xl:text-3xl poppinsFont700`}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				)}

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

			<div className={`flex flex-col md:justify-between grow lg:gap-y-5 2xl:gap-y-7 xl:gap-y-9 md:gap-x-5 gap-y-2 plusJakartaSans500`}>
				<div className="dashboardPostTileDataRow">
					<p className="h-fit">Utworzony: </p>
					<div className={`dashboardPostTileData plusJakartaSans700`}>{dateToDisplay}</div>
				</div>
				<div className="dashboardPostTileDataRow">
					<p className="h-fit">Autor: </p>
					<div className={`dashboardPostTileData plusJakartaSans700`}>{props.notificationData.author.name}</div>
				</div>
			</div>

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

				<button onClick={() => togglePin()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					{pinButtonText}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={faThumbTack} />
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
