"use client";
import NotificationTile from "@/app/dashboard/notifications/notificationTile";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");
	const [submitError, setSubmitError] = useState("");
	const [notifications, setNotifications] = useState<NotificationDataType[]>([]);
	const [notificationsCount, setNotificationsCount] = useState<number>(1);

	async function upload() {
		setSubmitError("");
		const data = new FormData();
		data.set("title", newTitle);
		data.set("content", newContent);

		try {
			const res = await fetch("/api/dashboard/notifications/", {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				const responseData = await res.json().catch(() => null);
				setSubmitError(responseData?.error || "Nie udało się dodać informacji.");
				return;
			}

			setNewTitle("");
			setNewContent("");
			refetchNotifications();
		} catch {
			setSubmitError("Wystąpił błąd połączenia. Spróbuj ponownie.");
		}
	}

	const router = useRouter();
	useEffect(() => {
		async function initFunction() {
			const session = (await getSession()) as SessionDataType | undefined;

			if (session) {
				if (session.user.role.manageNotifications) {
					fetchNotifications();
				} else router.push("/dashboard");
			} else router.push("/");
		}
		initFunction();
	}, [router]);

	async function fetchNotifications() {
		const returnedNotifications = await (await fetch(`/api/dashboard/notifications?count=${notificationsCount * 30}`)).json();
		setNotifications(returnedNotifications);

		setNotificationsCount((oldCount) => oldCount + 1);
	}

	async function refetchNotifications() {
		const returnedNotifications = await (await fetch(`/api/dashboard/notifications?count=${notificationsCount * 30}`)).json();
		setNotifications(returnedNotifications);
	}

	return (
		<div className="dashboard-page">
			<h1 className={`dashboard-heading poppinsFont700`}>Informacje</h1>

			<div className="flex flex-col items-center h-fit w-full text-left border-2 hover:bg-LightGray/40 bg-LightGray/20 transition-all duration-300 py-4 md:py-5 md:px-7 px-4 lg:py-7 lg:px-7 3xl:px-10 xl:py-8 gap-y-1.5 sm:gap-2 md:gap-3 rounded-2xl">
				<h1 className={`w-full sm:text-xl md:text-2xl poppinsFont700`}>Dodaj nową informację</h1>
				<input
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					type="text"
					id="title"
					placeholder="Podaj tytuł"
					className="bg-white rounded-lg p-2 outline-none w-full text-xs sm:text-sm md:text-base"
				/>
				<textarea
					onChange={(e) => setNewContent(e.target.value)}
					value={newContent}
					id="content"
					className="rounded-lg outline-none bg-white p-2 w-full text-2xs sm:text-xs md:text-sm h-20 sm:h-40 md:h-52 lg:h-60"
					placeholder="Podaj treść informacji"
				/>

				<button
					onClick={() => upload()}
					className={`w-fit bg-MainColor hover:bg-MainDarkGray transition-all duration-300 ease-out text-xs sm:text-sm md:text-base lg:text-lg px-20 my-5 py-3 text-white rounded-3xl plusJakartaSans800`}
				>
					Dodaj informację
				</button>
				{submitError && <p className="text-sm text-red-600 mt-1">{submitError}</p>}
			</div>

			<div className="flex w-full flex-col gap-y-3 md:gap-2 lg:gap-3 xl:gap-4 4xl:gap-6">
				{notifications.map((notificationData: NotificationDataType, i) => (
					<NotificationTile notificationData={notificationData} refetchNotifications={refetchNotifications} key={i} />
				))}

				<button
					onClick={() => fetchNotifications()}
					className={`text-center h-fit w-full border-2 text-xl hover:bg-LightGray/20 transition-all duration-300 p-4 px-8 rounded-2xl poppinsFont700 ${
						(notificationsCount - 1) * 30 > notifications.length ? "hidden" : ""
					}`}
				>
					Załaduj więcej
				</button>
			</div>
		</div>
	);
}
