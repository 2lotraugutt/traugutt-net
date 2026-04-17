"use client";
import { useState } from "react";

export default function CreateEventForm(props: { refetchEvents: Function; tags: EventTagDataType[] }) {
	const [newName, setNewName] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [newDate, setNewDate] = useState("");
	const [selectedTags, setSelectedTags] = useState<boolean[]>([]);
	const [buttonText, setButtonText] = useState("Dodaj wydarzenie");

	async function upload() {
		const data = new FormData();

		data.set("name", newName);
		data.set("description", newDescription);
		data.set("date", newDate.slice(8, 10) + "-" + newDate.slice(5, 7) + "-" + newDate.slice(0, 4));

		let i = 0;
		for (const bool of selectedTags) {
			if (bool) {
				data.append("tags[]", props.tags[i].id);
			}
			i++;
		}

		setButtonText("Dodawanie wydarzenia...");
		try {
			const res = await fetch("/api/dashboard/calendar/events/", {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				setButtonText("Wystąpił błąd");
				return;
			}

			setSelectedTags(new Array(props.tags.length).fill(false));
			setNewName("");
			setNewDescription("");
			setNewDate("");
			setButtonText("Dodaj wydarzenia");
			props.refetchEvents();
		} catch {
			setButtonText("Wystąpił błąd");
		}
	}

	return (
		<div className="flex flex-col items-center h-fit w-full text-left border-2 hover:bg-LightGray/40 bg-LightGray/20 transition-all duration-300 py-4 md:py-5 md:px-7 px-4 lg:py-7 lg:px-7 3xl:px-10 xl:py-8 gap-y-1.5 sm:gap-2 md:gap-3 rounded-2xl">
			<h1 className={`w-full sm:text-xl md:text-2xl poppinsFont700`}>Dodaj nowe wydarzenie</h1>

			<div className="flex gap-1.5 sm:gap-2 md:gap-3 w-full">
				<input
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					type="text"
					id="title"
					placeholder="Podaj nazwe"
					className="bg-white rounded-lg p-2 outline-none grow text-xs sm:text-sm md:text-base"
				/>
				<input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="rounded-lg p-2 w-fit text-center text-xs sm:text-sm md:text-base" />
			</div>

			<div className="flex items-center gap-x-2 sm:gap-x-3 hide-scrollbar overflow-x-auto w-full">
				{props.tags.map((tag, i) => (
					<button
						key={tag.id}
						onClick={() =>
							setSelectedTags((old) => {
								let newList = [...old];
								newList[i] = !old[i];
								return newList;
							})
						}
						className={`flex h-fit rounded-3xl py-1 gap-x-2 px-2 sm:px-3 items-center transition-color duration-300`}
						style={{ backgroundColor: selectedTags[i] ? tag.color : "white" }}
					>
						<div
							className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-color duration-300`}
							style={{ backgroundColor: selectedTags[i] ? "white" : tag.color }}
						/>
						<p
							className={`text-xs whitespace-nowrap sm:text-sm md:text-base transition-color duration-300 poppinsFont500 ${
								selectedTags[i] ? "text-white" : "text-MainDarkGray"
							}`}
						>
							{tag.name}
						</p>
					</button>
				))}
			</div>

			<textarea
				onChange={(e) => setNewDescription(e.target.value)}
				value={newDescription}
				id="content"
				className="rounded-lg outline-none bg-white p-2 w-full text-2xs sm:text-xs h-20 sm:h-40 md:h-52 lg:h-60 md:text-sm"
				placeholder="Podaj treść informacji"
			/>

			<button
				onClick={() => upload()}
				className={`w-fit whitespace-nowrap bg-MainColor hover:bg-MainDarkGray transition-all duration-300 ease-out text-xs sm:text-sm md:text-base lg:text-lg px-12 sm:px-20 py-2 sm:py-3 text-white rounded-3xl plusJakartaSans800`}
			>
				{buttonText}
			</button>
		</div>
	);
}
