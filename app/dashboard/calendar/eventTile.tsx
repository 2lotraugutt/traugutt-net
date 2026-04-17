import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parse } from "date-fns";
import { useState } from "react";
import EditingForm from "./editingForm";

export default function EventTile(props: { eventData: EventDataTypeWithAuthor; refetchEvents: Function; tags: EventTagDataType[] }) {
	const [deleteButtonText, setDeleteButtonText] = useState("Usuń wydarzenie");
	const [isEditing, setIsEditing] = useState(false);

	function returnDate(date: string) {
		const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

		let newDate = parse(date, "dd-MM-yyyy", new Date());
		if (isNaN(newDate.getTime())) newDate = new Date(date);

		return newDate.getDate() + " " + months[newDate.getMonth()] + " " + newDate.getFullYear();
	}

	async function deleteEvent() {
		const data = new FormData();

		data.set("id", props.eventData.id);

		setDeleteButtonText("Usuwanie wydarzenia...");
		try {
			const res = await fetch("/api/dashboard/calendar/events/", {
				method: "DELETE",
				body: data,
			});

			if (!res.ok) {
				setDeleteButtonText("Wystąpił błąd");
				return;
			}

			setDeleteButtonText("Usuń wydarzenie");
			props.refetchEvents();
		} catch {
			setDeleteButtonText("Wystąpił błąd");
		}
	}

	return (
		<div className="h-fit w-full text-left flex-col xl:flex-row xl:items-center border-2 hover:bg-LightGray/40 transition-all duration-300 py-5 md:py-6 md:px-8 px-5 lg:py-8 lg:px-8 3xl:px-12 xl:py-9 flex gap-y-4 md:gap-y-6 lg:gap-y-10 xl:gap-x-10 rounded-2xl">
			<div className="flex xl:max-w-[34rem] 2xl:max-w-[46.5rem] 3xl:max-w-4xl 4xl:max-w-[69rem] flex-col gap-y-2 xl:gap-y-5 lg:gap-y-3.5 w-full">
				<p className={`line-clamp-1 md:line-clamp-2 text-sm 2xs:text-lg xs:text-lg sm:text-xl md:text-2xl 4xl:text-3xl poppinsFont700`}>{props.eventData.name}</p>

				<div className={`text-2xs 2xl:text-base text-MainDarkGray/50 2xs:text-xs xs:text-sm 3xl:line-clamp-5 4xl:line-clamp-6 line-clamp-4 poppinsFont400`}>
					{props.eventData.description}
				</div>

				<div className="flex items-center gap-x-2 sm:gap-x-3 hide-scrollbar overflow-x-auto w-full">
					{props.eventData.tags.map((tag, i) => (
						<div key={tag.id} className={`flex h-fit rounded-3xl py-1 gap-x-2 px-2 sm:px-3 items-center transition-color duration-300 bg-white`}>
							<div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-color duration-300 `} style={{ backgroundColor: tag.color }} />
							<p className={`text-xs whitespace-nowrap sm:text-sm md:text-base transition-color duration-300 poppinsFont500 text-MainDarkGray`}>{tag.name}</p>
						</div>
					))}
				</div>
			</div>

			<div className={`flex flex-col md:flex-row md:justify-between xl:justify-evenly xl:gap-5 grow gap-y-2 flex-wrap plusJakartaSans500`}>
				<div className="dashboardPostTileDataRow">
					<p className="h-fit">Data: </p>
					<div className={`dashboardPostTileData plusJakartaSans700`}>{returnDate(props.eventData.date)}</div>
				</div>
				<div className="dashboardPostTileDataRow">
					<p className="h-fit">Utworzony: </p>
					<div className={`dashboardPostTileData plusJakartaSans700`}>{returnDate(props.eventData.createdAt.toString())}</div>
				</div>
				<div className="dashboardPostTileDataRow">
					<p className="h-fit">Autor: </p>
					<div className={`dashboardPostTileData plusJakartaSans700`}>{props.eventData.author.name}</div>
				</div>
			</div>

			<div className="flex sm:grid sm:grid-cols-2 md:flex justify-between xl:justify-normal gap-y-2 2xl:gap-y-3 flex-col md:flex-row xl:flex-col gap-x-5">
				<button onClick={() => setIsEditing(true)} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					Edytuj wydarzenie
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={faPen} />
					</div>
				</button>
				<button onClick={() => deleteEvent()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					{deleteButtonText}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={faTrash} />
					</div>
				</button>
			</div>

			{isEditing && <EditingForm refetchEvents={props.refetchEvents} initialData={props.eventData} closeEdit={() => setIsEditing(false)} tags={props.tags} />}
		</div>
	);
}
