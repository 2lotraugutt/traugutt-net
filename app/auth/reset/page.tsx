"use client";

import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
	const [login, setLogin] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const handleReset = async () => {
		const data = new FormData();
		data.set("login", login!);

		const res = await fetch("/api/email_reset", {
			method: "POST",
			body: data,
		});

		if (res.ok) {
			setMessage(`Link do resetowania hasła został wysłany na adres (${(await res.json()).email}).`);
		} else {
			setMessage("Nie udało się wysłać linku.");
		}
	};

	return (
		<div className="w-screen top-0 left-0 z-20 absolute h-screen bg-white">
			<div className="w-full h-full absolute">
				<Image src="/Blob.svg" width="500" height="500" className="hidden xl:block absolute w-fit h-3/4 xl:left-32 2xl:left-72 top-1/2 -translate-y-1/2" alt="" />
				<Image src="/Wave-2.svg" width="1920" height="1080" className="xl:hidden absolute top-0 right-0 w-full h-full object-center object-cover" alt="" />
				<Image src="/Wave.svg" width="1920" height="1080" className="hidden xl:block absolute top-0 left-0 w-full h-full object-left object-cover" alt="" />
			</div>

			<div className="right-0 h-full absolute w-full xl:w-fit 3xl:w-2/5 flex items-center justify-center xl:px-8 2xl:px-10">
				<div className="p-4 md:p-20 text-center items-center flex flex-col gap-6 pb-12 md:pb-40 xl:gap-y-8 lg:pb-32">
					<Image src="/logo.png" width="250" height="100" alt="Logo icon" />

					<h1 className="text-3xl sm:text-5xl xl:text-6xl poppinsFont700">Resetuj hasło</h1>
					<h2 className="text-base sm:text-lg -mt-3 xl:text-xl poppinsFont500">Podaj swój Login służbowy</h2>

					<div className="flex flex-col gap-y-3 2xl:gap-y-4 w-full">
						<input className="login-input !w-full poppinsFont500" value={login} placeholder="Login" type="text" onChange={(e) => setLogin(e.target.value)} />
						<button disabled={!login} onClick={handleReset} className="login-button !w-full poppinsFont700">
							Wyślij link
							<FontAwesomeIcon icon={faArrowCircleRight} className="ms-5 md:text-4xl text-2xl w-6 h-6 md:h-9 md:w-9" />
						</button>
						{message && <div className="text-MainRed poppinsFont700 mt-2 max-w-sm mx-auto">{message}</div>}
					</div>
				</div>
			</div>
		</div>
	);
}
