"use client";

import NewPostStageSeven from "@/components/postStages/newPostStageSeven";
import NewPostStageZero from "@/components/postStages/newPostStageZero";
import StageFive from "@/components/postStages/stageFive";
import StageFour from "@/components/postStages/stageFour";
import StageOne from "@/components/postStages/stageOne";
import StageSix from "@/components/postStages/stageSix";
import StageThree from "@/components/postStages/stageThree";
import StageTwo from "@/components/postStages/stageTwo";
import { useState } from "react";

export default function Page() {
	const [stage, setStage] = useState(0);
	const [title, setTitle] = useState("");
	const [image, setImage] = useState<File | any>();
	const [imageName, setImageName] = useState("");
	const [content, setContent] = useState("");
	const [gallery, setGallery] = useState<{ name: string; image: File }[]>([]);
	const [eventId, setEventId] = useState<string | null>(null);

	const [uploaded, setUploaded] = useState(false);

	function stageUp() {
		setStage((oldStage) => oldStage + 1);
	}
	function stageDown() {
		if (stage == 5 && content == "") setStage(3);
		else setStage((oldStage) => oldStage - 1);
	}
	async function upload() {
		const data = new FormData();
		data.set("title", title);
		data.set("image", image);
		data.set("content", content);
		if (eventId) data.set("eventId", eventId);

		for (const file of gallery) {
			data.append("gallery[]", file.image as any, file.image.name);
		}

		try {
			const res = await fetch("/api/dashboard/posts/post", {
				method: "POST",
				body: data,
			});

			if (!res.ok) {
				setUploaded(false);
				return;
			}

			setUploaded(true);
		} catch {
			setUploaded(false);
		}
	}

	if (stage == 0) return <NewPostStageZero up={stageUp} />;
	if (stage == 1) return <StageOne down={stageDown} up={stageUp} setTitle={(text: string) => setTitle(text)} initTitle={title} />;
	if (stage == 2)
		return (
			<StageTwo
				down={stageDown}
				up={stageUp}
				setImage={(image: File) => setImage(image)}
				setImageName={(name: string) => setImageName(name)}
				initImageName={imageName}
				initImage={image}
			/>
		);
	if (stage == 3) return <StageThree initContent={content} down={stageDown} up={stageUp} setContent={(content: string) => setContent(content)} />;
	if (stage == 4) {
		if (content != "") return <StageFour down={stageDown} up={stageUp} content={content} />;
		else {
			setStage(5);
			return <></>;
		}
	}
	if (stage == 5) return <StageFive down={stageDown} up={stageUp} setGallery={(gallery: { name: string; image: File }[]) => setGallery(gallery)} initGallery={gallery} />;
	if (stage == 6) return <StageSix down={stageDown} up={stageUp} setEvent={(eventId: string | null) => setEventId(eventId)} initEventId={eventId} />;
	if (stage == 7) return <NewPostStageSeven down={stageDown} upload={upload} uploaded={uploaded} />;
	else setStage(0);
}
