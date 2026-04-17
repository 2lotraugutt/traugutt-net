"use client";

import LoadingLayout from "@/app/dashboard/loadingLayout";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageTile from "./pageTile";

export default function Page() {
	const [userSession, setSession] = useState<SessionDataType>();
	const [pages, setPages] = useState<{ file: string; content: string }[]>([]);
	const [newPageName, setNewPageName] = useState("");
	const [newContent, setNewContent] = useState("");
	const [filter, setFilter] = useState("");
	const [submitError, setSubmitError] = useState("");

	const router = useRouter();
	useEffect(() => {
		async function initFunction() {
			const session = (await getSession()) as SessionDataType | undefined;

			if (session) {
				if (session.user.role.managePages) {
					fetchPages();
					setSession(session);
				} else router.push("/dashboard");
			} else router.push("/");
		}
		initFunction();
	}, [router]);

	async function fetchPages() {
		const returnedPages = await (
			await fetch(`/api/dashboard/pages`, {
				cache: "no-store",
			})
		).json();
		setPages(returnedPages);
	}

	async function addPage() {
		setSubmitError("");
		const data = new FormData();
		data.set("content", newContent);

		try {
			const res = await fetch(`/api/dashboard/pages/${newPageName}.mdx`, {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				const responseData = await res.json().catch(() => null);
				setSubmitError(responseData?.error || "Nie udało się dodać podstrony.");
				return;
			}

			setNewPageName("");
			setNewContent("");
			fetchPages();
		} catch {
			setSubmitError("Wystąpił błąd połączenia. Spróbuj ponownie.");
		}
	}

	if (pages && userSession)
		return (
			<div className="dashboard-page">
				<h1 className={`dashboard-heading poppinsFont700`}>Podstrony</h1>

				<div className="flex flex-col items-center h-fit w-full text-left border-2 hover:bg-LightGray/40 bg-LightGray/20 transition-all duration-300 py-4 md:py-5 md:px-7 px-4 lg:py-7 lg:px-7 3xl:px-10 xl:py-8 gap-y-1.5 sm:gap-2 md:gap-3 rounded-2xl">
					<h1 className={`w-full sm:text-xl md:text-2xl poppinsFont700`}>Dodaj nową podstronę</h1>
					<input
						value={newPageName}
						onChange={(e) => setNewPageName(e.target.value)}
						type="text"
						id="PageName"
						placeholder="Podaj nazwę (bez spacji i znaków specjalnych, po utworzeniu będzie widoczna tylko w linku)"
						className="bg-white rounded-lg p-2 outline-none w-full text-xs sm:text-sm md:text-base"
					/>

					<MdEditor
						modelValue={newContent}
						onChange={setNewContent}
						language="en-US"
						noUploadImg
						placeholder="Podaj treść podstrony"
						className="rounded-lg outline-none bg-white p-2 w-full h-20 sm:h-40 md:h-52 lg:h-60"
					/>

					<button
						onClick={() => addPage()}
						disabled={newContent.trim() == "" || newPageName.trim() == ""}
						className={`w-fit bg-MainColor hover:bg-MainDarkGray disabled:!bg-MainDarkGray transition-all duration-300 ease-out text-xs sm:text-sm md:text-base lg:text-lg px-20 my-5 py-3 text-white rounded-3xl plusJakartaSans800`}
					>
						Dodaj podstronę
					</button>
					{submitError && <p className="text-sm text-red-600 mt-1">{submitError}</p>}
				</div>

				<input
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder="Filtruj strony"
					className="bg-white border-2 focus:bg-LightGray/40 bg-LightGray/20 transition-all duration-300 rounded-lg p-2 outline-none w-full text-xs sm:text-sm md:text-base lg:text-lg py-4 md:py-5 md:px-7 px-4 lg:py-7 lg:px-7 sm:gap-2 md:gap-3"
				/>

				<div className="flex w-full flex-col gap-y-3 md:gap-2 lg:gap-3 xl:gap-4 4xl:gap-6">
					{pages
						.filter((pageData) => pageData.file.includes(filter))
						.map((pageData, i) => (
							<PageTile pageData={pageData} key={i} refetchPages={() => fetchPages()} />
						))}

					{filter != "" && (
						<>
							<hr />
							{pages
								.filter((pageData) => pageData.content.includes(filter))
								.map((pageData, i) => (
									<PageTile pageData={pageData} key={i} refetchPages={() => fetchPages()} />
								))}
						</>
					)}
				</div>
			</div>
		);
	else return <LoadingLayout />;
}
