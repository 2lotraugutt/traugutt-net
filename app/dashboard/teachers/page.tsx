"use client";
import { TeacherDataType } from "@/global";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TeacherTile from "./teacherTile";

export default function TeacherDashboardPage() {
	const [newName, setNewName] = useState("");
	const [newLastName, setNewLastName] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [newTitle, setNewTitle] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newClass, setNewClass] = useState("");

	const [newImage, setNewImage] = useState("");
	const [teachers, setTeachers] = useState<TeacherDataType[]>([]);
	const [emailValid, setEmailValid] = useState(true);
	const [imageError, setImageError] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const router = useRouter();

	const [subjectInput, setSubjectInput] = useState("");
	const [newSubjects, setNewSubjects] = useState<string[]>([]);

	function addSubject() {
		if (subjectInput.trim() === "") return;
		if (!newSubjects.includes(subjectInput.trim())) {
			setNewSubjects([...newSubjects, subjectInput.trim()]);
		}
		setSubjectInput("");
	}

	function removeSubject(index: number) {
		const updated = [...newSubjects];
		updated.splice(index, 1);
		setNewSubjects(updated);
	}

	useEffect(() => {
		async function initFunction() {
			const session = (await getSession()) as any;

			if (session) {
				if (session.user.role.manageTeachers) {
					fetchTeachers();
				} else router.push("/dashboard");
			} else router.push("/");
		}
		initFunction();
	}, [router]);

	async function fetchTeachers() {
		const response = await fetch("/api/teachers");
		const data = await response.json();
		setTeachers(data);
	}

	function validateEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setEmailValid(emailRegex.test(email) || email === "");
	}

	async function upload() {
		if (!emailValid) return;

		if (!newName.trim() || !newLastName.trim()) {
			setSubmitError("Imię i nazwisko są wymagane.");
			return;
		}

		setSubmitError("");

		const data = new FormData();
		data.append("image", newImage);
		data.append("name", newName);
		data.append("lastName", newLastName);
		data.append("title", newTitle);
		data.append("description", newDescription);
		data.append("email", newEmail);
		data.append("class", newClass);
		data.append("subjects", JSON.stringify(newSubjects)); // Send array as stringified JSON

		try {
			const res = await fetch("/api/dashboard/teachers", {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				const responseData = await res.json().catch(() => null);
				setSubmitError(responseData?.error || "Nie udało się dodać nauczyciela.");
				return;
			}

			setNewName("");
			setNewLastName("");
			setNewTitle("");
			setNewDescription("");
			setNewEmail("");
			setNewClass("");
			setNewSubjects([]);
			setNewImage("");
			setSubjectInput("");
			fetchTeachers();
		} catch {
			setSubmitError("Wystąpił błąd połączenia. Spróbuj ponownie.");
		}
	}

	function cleanEmail(email: string) {
		return email
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/ł/g, "l");
	}

	return (
		<div className="dashboard-page">
			<h1 className="dashboard-heading poppinsFont700">Kadra</h1>

			<div className="flex flex-col items-center h-fit w-full text-left border-2 hover:bg-LightGray/40 bg-LightGray/20 transition-all duration-300 py-4 md:py-5 md:px-7 px-4 lg:py-7 lg:px-7 3xl:px-10 xl:py-8 gap-y-1.5 sm:gap-x-2 md:gap-x-3.5 rounded-2xl">
				<h1 className="w-full text-xl mb-2 sm:text-2xl poppinsFont700">Dodaj nowego nauczyciela</h1>

				<div className="w-full">
					<h2 className="text-sm 2xl:text-base sm:text-base font-semibold text-gray-700 mb-1">Podstawowe informacje</h2>
					<div className="flex flex-col sm:flex-row gap-3 w-full">
						<input
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							type="text"
							placeholder="Tytuł naukowy (opcjonalnie)"
							className="bg-white rounded-lg p-2 outline-none w-full text-sm 2xl:text-base"
						/>
						<input
							value={newName}
							onChange={(e) => {
								setNewName(e.target.value);
								if (e.target.value && newLastName) {
									const defaultEmail = `${cleanEmail(e.target.value)}.${cleanEmail(newLastName)}@traugutt.net`;
									setNewEmail(defaultEmail);
									validateEmail(defaultEmail);
								} else {
									setNewEmail("");
									setEmailValid(true);
								}
							}}
							type="text"
							placeholder="Imię"
							className="bg-white rounded-lg p-2 outline-none w-full text-sm 2xl:text-base"
						/>
						<input
							value={newLastName}
							onChange={(e) => {
								setNewLastName(e.target.value);
								if (e.target.value && newName) {
									const defaultEmail = `${cleanEmail(newName)}.${cleanEmail(e.target.value)}@traugutt.net`;
									setNewEmail(defaultEmail);
									validateEmail(defaultEmail);
								} else {
									setNewEmail("");
									setEmailValid(true);
								}
							}}
							type="text"
							placeholder="Nazwisko"
							className="bg-white rounded-lg p-2 outline-none w-full text-sm 2xl:text-base"
						/>
					</div>
				</div>

				<div className="w-full">
					<h2 className="text-sm 2xl:text-base sm:text-base font-semibold text-gray-700 mb-1 mt-1">Dane kontaktowe</h2>
					<input
						value={newEmail}
						onChange={(e) => {
							setNewEmail(e.target.value);
							validateEmail(e.target.value);
						}}
						type="email"
						placeholder="Email"
						className={`rounded-lg p-2 outline-none w-full text-sm 2xl:text-base ${emailValid ? "bg-white" : "bg-red-200"}`}
					/>
				</div>

				{/* Sekcja klasy i przedmiotów */}
				<div className="w-full">
					<h2 className="text-sm 2xl:text-base sm:text-base font-semibold text-gray-700 mb-1 mt-1">Klasa i przedmioty</h2>
					<div className="flex flex-col sm:flex-row gap-3 w-full">
						<input
							value={newClass}
							onChange={(e) => setNewClass(e.target.value)}
							type="text"
							placeholder="Wychowawca klasy (opcjonalnie)"
							className="bg-white rounded-lg p-2 outline-none w-full text-sm 2xl:text-base basis-2/5"
						/>

						<div className="flex w-full gap-2 items-center">
							<input
								value={subjectInput}
								onChange={(e) => setSubjectInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
								type="text"
								placeholder="Dodaj przedmiot i naciśnij Enter"
								className="bg-white rounded-lg p-2 outline-none w-full text-sm 2xl:text-base grow"
							/>

							<button type="button" onClick={addSubject} className="px-4 py-2 bg-MainColor text-white rounded-xl text-xs hover:bg-MainDarkGray transition-all">
								Dodaj
							</button>
						</div>
					</div>

					{newSubjects.length > 0 && (
						<div className="flex flex-wrap gap-2 w-full mt-2">
							<p className="text-sm 2xl:text-base text-gray-500">Dodane przedmioty:</p>
							{newSubjects.map((subj, index) => (
								<div key={index} className="bg-MainColor text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
									{subj}
									<button type="button" onClick={() => removeSubject(index)} className="ml-1 text-white font-bold hover:text-red-300">
										×
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Sekcja opisu */}
				<div className="w-full flex flex-col gap-3">
					<h2 className="text-sm 2xl:text-base sm:text-base font-semibold text-gray-700 mb-1 mt-1">Opis i zdjęcie</h2>
					<div className="flex flex-row gap-3">
						<textarea
							value={newDescription}
							onChange={(e) => setNewDescription(e.target.value)}
							placeholder="Opis nauczyciela (opcjonalnie)"
							className="rounded-lg outline-none bg-white p-2 w-full text-sm 2xl:text-base h-32 sm:h-40"
						/>
						{newImage != "" && !imageError && (
							<img src={newImage} alt="Podgląd zdjęcia" className="w-32 h-32 object-cover rounded-xl border mt-2" onError={() => setImageError(true)} />
						)}
					</div>
					<input
						value={newImage}
						onChange={(e) => {
							setNewImage(e.target.value);
							setImageError(false);
						}}
						type="text"
						placeholder="Link do zdjęcia"
						className="bg-white rounded-lg p-2 outline-none w-full text-sm 2xl:text-base"
					/>
				</div>

				{/* Przycisk */}
				<button
					onClick={upload}
					disabled={!emailValid}
					className="w-fit bg-MainColor hover:bg-MainDarkGray transition-all duration-300 ease-out text-sm 2xl:text-base px-10 py-3 mt-4 text-white rounded-3xl plusJakartaSans800 disabled:opacity-50"
				>
					Dodaj nauczyciela
				</button>
				{submitError && <p className="text-sm text-red-600 mt-1">{submitError}</p>}
			</div>

			<div className="flex w-full flex-col gap-y-3 mt-6">
				{teachers.map((teacher, i) => (
					<TeacherTile teacherData={teacher} refetchTeachers={fetchTeachers} key={i} />
				))}
			</div>
		</div>
	);
}
