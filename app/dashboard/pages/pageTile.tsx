import removeMarkdown from "@/lib/removeMarkdown";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCancel, faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useState } from "react";

export default function PageTile(props: { pageData: { file: string; content: string }; refetchPages: Function }) {
	const [deleteButtonText, setDeleteButtonText] = useState("Usuń podstronę");
	const [newContent, setNewContent] = useState(props.pageData.content);
	const [editing, setEditing] = useState(false);
	const [editError, setEditError] = useState("");

	async function deletePost() {
		setDeleteButtonText("Usuwanie...");

		await (
			await fetch(`/api/dashboard/pages/${props.pageData.file}`, {
				method: "DELETE",
			})
		).json();

		setDeleteButtonText("Usuń podstronę");
		props.refetchPages();
	}

	async function toggleEditing() {
		if (editing) {
			setEditError("");
			const data = new FormData();
			data.set("content", newContent);

			try {
				const res = await fetch(`/api/dashboard/pages/${props.pageData.file}`, {
					method: "POST",
					body: data,
				});

				if (!res.ok) {
					setEditError("Nie udało się zapisać zmian.");
					return;
				}

				props.refetchPages();
				setEditing(false);
			} catch {
				setEditError("Wystąpił błąd połączenia.");
			}
		} else {
			setEditError("");
			setNewContent(props.pageData.content);
			setEditing(true);
		}
	}
	const copylink = (link: string) => {
		navigator.clipboard.writeText(link);
	};

	return (
		<div className="h-fit w-full text-left flex-col xl:flex-row xl:items-center border-2 hover:bg-LightGray/40 transition-all duration-300 py-5 md:py-6 md:px-8 px-5 lg:py-8 lg:px-8 3xl:px-12 xl:py-9 flex gap-y-4 md:gap-y-6 lg:gap-y-10 xl:gap-x-10 rounded-2xl">
			<div className="flex relative flex-col gap-y-2 xl:gap-y-5 lg:gap-y-3.5 w-full">
				<p className={`line-clamp-2 md:line-clamp-none text-sm 2xs:text-lg xs:text-lg sm:text-xl md:text-2xl 4xl:text-3xl poppinsFont700`}>
					{props.pageData.file.slice(0, -4)}
					<p className="text-xs sm:text-sm md:text-base lg:text-lg flex">
						(do dodania linku:
						<p onClick={() => copylink(`/page/${props.pageData.file.slice(0, -4)}`)} className="ms-1 cursor-pointer hover:text-MainColor transition-all">
							/page/{props.pageData.file.slice(0, -4)}
							<FontAwesomeIcon icon={faCopy} className="h-4 w-4 ms-1.5" />
						</p>
						)
					</p>
				</p>
				{editing ? (
					<MdEditor
						modelValue={newContent}
						onChange={setNewContent}
						language="en-US"
						noUploadImg
						placeholder="Edytuj treść podstrony"
						className="rounded-lg outline-none bg-white p-2 !h-[70vh] w-full"
					/>
				) : (
					<p className={`text-2xs 2xl:text-base text-MainDarkGray/50 2xs:text-xs xs:text-sm 3xl:line-clamp-5 4xl:line-clamp-6 line-clamp-4 poppinsFont400`}>
						{removeMarkdown(props.pageData.content ?? "")}
					</p>
				)}
			</div>

			<div className="flex justify-between xl:justify-normal gap-y-2 2xl:gap-y-3 flex-col md:flex-row xl:flex-col gap-x-5">
				<button onClick={() => toggleEditing()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					{editing ? "Potwierdź zmiany" : "Edytuj podstronę"}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={editing ? faCheck : faPen} />
					</div>
				</button>
				{editing && (
					<button onClick={() => setEditing(false)} className={`group/button dashboard-post-tile plusJakartaSans700`}>
						Anuluj edycję
						<div className="dashboard-post-tile-icon">
							<FontAwesomeIcon icon={faCancel} />
						</div>
					</button>
				)}

				<button onClick={() => deletePost()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
					{deleteButtonText}
					<div className="dashboard-post-tile-icon">
						<FontAwesomeIcon icon={faTrash} />
					</div>
				</button>
				{editError && <p className="text-sm text-red-600">{editError}</p>}
			</div>
		</div>
	);
}
