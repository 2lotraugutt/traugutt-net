"use client";

import EditPostStageSeven from "@/components/postStages/editPostStageSeven";
import EditPostStageZero from "@/components/postStages/editPostStageZero";
import StageFour from "@/components/postStages/stageFour";
import StageOne from "@/components/postStages/stageOne";
import StageSix from "@/components/postStages/stageSix";
import StageThree from "@/components/postStages/stageThree";
import StageTwo from "@/components/postStages/stageTwo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
	const [stage, setStage] = useState(0);
	const [id, setId] = useState("");
	const [title, setTitle] = useState("");
	const [image, setImage] = useState<File | any>();
	const [imageName, setImageName] = useState("");
	const [content, setContent] = useState("");
	const [eventId, setEventId] = useState<string | null>(null);
	const [gallery, setGallery] = useState<{ name: string; image: File | undefined }[]>([]);

	const [uploaded, setUploaded] = useState(false);

	const router = useRouter();
	useEffect(() => {
		fetchPosts();

		async function fetchPosts() {
			const post = (await (await fetch(`/api/posts/post/${params.id}`)).json()) as PostDataType;

			if (post) {
				setId(post.id);
				var img = new Image();
				img.src = post.titleImage;
				setTitle(post.title);
				setImageName(post.titleImage);
				setContent(post.content ?? "");
				setEventId(post.eventId);
				setGallery(
					post.gallery.map((image) => {
						const data = {
							name: image,
							image: undefined,
						};
						return data;
					}),
				);
			} else router.back();
		}
	}, [params.id, router]);

	function stageUp() {
		setStage((oldStage) => oldStage + 1);
	}
	function stageDown() {
		if (stage == 5 && content == "") setStage(3);
		else setStage((oldStage) => oldStage - 1);
	}
	async function upload() {
		const data = new FormData();
		data.set("id", id);

		data.set("title", title);
		data.set("image", image ?? "");
		data.set("imageName", imageName);
		data.set("content", content);

		if (eventId) data.set("eventId", eventId);

		for (const file of gallery) {
			data.append("gallery[]", file.image ?? "");
			data.append("galleryNames[]", file.name as string);
		}

		try {
			const res = await fetch("/api/dashboard/posts/post", {
				method: "PUT",
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

	if (stage == 0) return <EditPostStageZero up={stageUp} />;
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
	// if (stage == 5) return <StageFive down={stageDown} up={stageUp} setGallery={(gallery: { name: string; image: File }[]) => setGallery(gallery)} initGallery={gallery} />;
	if (stage == 5) return <StageSix down={stageDown} up={stageUp} setEvent={(eventId: string | null) => setEventId(eventId)} initEventId={eventId} />;
	if (stage == 6) return <EditPostStageSeven down={stageDown} upload={upload} uploaded={uploaded} />;
	else setStage(0);
}
