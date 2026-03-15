import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = (await (await fetch(process.env.NEXTAUTH_URL + `/api/posts`)).json()) as PostDataType[];
	const postSites = posts.map((post) => {
		return {
			url: process.env.NEXTAUTH_URL + "/post/" + post.id,
			lastModified: post.createdAt,
			priority: 0.9,
		};
	});

	const tags = (await (await fetch(process.env.NEXTAUTH_URL + `/api/calendar/tags`)).json()) as EventTagDataType[];
	const tagSites = tags.map((tag) => {
		return {
			url: process.env.NEXTAUTH_URL + "/calendar?tag=" + tag.id,
			lastModified: tag.createdAt,
			priority: 0.6,
		};
	});

	const routes = (await (await fetch(process.env.NEXTAUTH_URL + `/api/routes`)).json()) as RouteDataType[];
	const routeSites = routes
		.filter((route) => route.link[0] == "/")
		.map((route) => {
			return {
				url: process.env.NEXTAUTH_URL + route.link,
				lastModified: route.createdAt,
				priority: 0.8,
			};
		});

	return [
		{
			url: "https://traugutt.net/",
			lastModified: new Date(),
			priority: 1,
		},
		{
			url: "https://traugutt.net/calendar",
			lastModified: new Date(),
			priority: 0.8,
		},
		{
			url: "https://traugutt.net/auth/signin",
			lastModified: new Date(),
			priority: 0.7,
		},
		...routeSites,
		...postSites,
		...tagSites,
	];
}
export const dynamic = "force-dynamic";
