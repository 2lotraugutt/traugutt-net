"use client";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function EditComponent(props: { text: string | null }) {
	const [edit, setEdit] = useState<boolean>(false);
	const [show, setShow] = useState<boolean>(false);
	const [newContent, setNewContent] = useState(props.text);
	const [submitError, setSubmitError] = useState("");

	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		async function initFunction() {
			const session = (await getSession()) as any;

			if (session && session.user.role.managePages) {
				setEdit(true);
			}
		}
		initFunction();
	}, [router]);

	async function confirmEdit() {
		setSubmitError("");
		const data = new FormData();
		data.set("content", newContent!);

		try {
			const res = await fetch(`/api/dashboard/pages/${pathname.split("/").at(-1)}.mdx`, {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				const responseData = await res.json().catch(() => null);
				setSubmitError(responseData?.error || "Nie udało się zapisać zmian.");
				return;
			}

			router.refresh();
		} catch {
			setSubmitError("Wystąpił błąd połączenia. Spróbuj ponownie.");
		}
	}
	if (edit && newContent != null)
		return (
			<div className="flex flex-col h-fit w-full text-left border-2 hover:bg-LightGray/40 bg-LightGray/20 transition-all duration-300 py-4 md:py-5 md:px-7 px-4 lg:py-7 lg:px-7 3xl:px-10 xl:py-8 gap-y-1.5 sm:gap-2 md:gap-3 rounded-2xl">
				<h1 onClick={() => setShow((old) => !old)} className={`dashboard-heading cursor-pointer poppinsFont700`}>
					Edytuj stronę
				</h1>

				{show && (
					<>
						<MdEditor
							modelValue={newContent}
							onChange={setNewContent}
							language="en-US"
							onSave={confirmEdit}
							noUploadImg
							placeholder="Edytuj treść podstrony"
							className="rounded-lg outline-none bg-white p-2 !h-[70vh] w-full"
						/>

						<button onClick={() => confirmEdit()} className={`group/button dashboard-post-tile plusJakartaSans700`}>
							Potwierdź zmiany
							<div className="dashboard-post-tile-icon">
								<FontAwesomeIcon icon={faCheck} />
							</div>
						</button>
						{submitError && <p className="text-sm text-red-600">{submitError}</p>}
					</>
				)}
			</div>
		);
}

export default EditComponent;
