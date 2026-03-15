"use client";

import PostGallery from "@/app/post/postGallery";
import PostHeading from "@/app/post/postHeading";
import PostSkeleton from "@/app/post/postSkeleton";
import PostTileSkeleton from "@/components/posts/postTileSkeleton";
import TopPostTile from "@/components/posts/topPostTile";
import MarkdownDisplay from "@/lib/markdownDisplay";
import "md-editor-rt/lib/preview.css";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
	const [post, setPost] = useState<PostDataType | undefined>();
	const [topPosts, setTopPost] = useState<PostDataType[] | undefined>();

	useEffect(() => {
		fetchPosts();
		fetchTopPosts();
		async function fetchTopPosts() {
			const posts = await (await fetch("/api/posts/topPosts/?count=4")).json();

			const filteredTopPosts = posts.filter((topPost: PostDataType) => String(topPost.id) !== params.id).slice(0, 3);

			setTopPost(filteredTopPosts);
		}

		async function fetchPosts() {
			const hasViewed = localStorage.getItem(`viewed_${params.id}`);

			const post = await (await fetch(`/api/posts/post/${params.id}`)).json();

			setPost(post);
			if (!hasViewed) {
				fetch(`/api/posts/post/views/${params.id}`);

				localStorage.setItem(`viewed_${params.id}`, "true");
			}
		}
	}, [params.id]);

	return (
		<div className="flex flex-col w-full">
			{post ? (
				<>
					<PostHeading post={post} />
					<MarkdownDisplay text={post.content} />

					<PostGallery post={post} />
				</>
			) : (
				<PostSkeleton />
			)}

			<div className="lg:mx-12 mx-3 xs:mx-7 2xs:mx-5 sm:mx-10 md:mx-5 4xl:mx-0">
				<h2
					className={`text-center my-5 4xl:text-5xl text-sm !leading-[150%] h-fit xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl peer line-clamp-2 tracking-wide poppinsFont700`}
				>
					Najpopularniejsze posty w tym miesiącu
				</h2>

				<div id="top-posts-container" className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 w-full md:gap-2 lg:gap-4 xl:gap-7 4xl:gap-10 last:text-black">
					{topPosts
						? topPosts.map((postData: PostDataType, i) => <TopPostTile postData={postData} key={postData.id} index={i + 1} />)
						: [...Array(3)].map((i) => <PostTileSkeleton key={i} />)}
				</div>
			</div>
		</div>
	);
}
