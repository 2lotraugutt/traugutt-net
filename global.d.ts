export declare global {
	type JustPostDataType = {
		id: string;
		title: string;
		content: string?;
		titleImage: string;
		gallery: string[];
		createdAt: Date;
		views: number;
		authorId: string;
		published: boolean;
		pinned: boolean;
		publishedById: ?string;
		pinnedById: ?string;
		editedById: ?string;
		eventId: ?string;
	};

	type PostDataType = {
		id: string;
		title: string;
		content: string?;
		titleImage: string;
		gallery: string[];
		createdAt: Date;
		views: number;
		authorId: string;
		author: JustUserDataType;
		published: boolean;
		pinned: boolean;
		publishedById: ?string;
		pinnedById: ?string;
		editedById: ?string;
		eventId: ?string;
		event: EventDataType;
		publishedBy: ?JustUserDataType;
		pinnedBy: ?JustUserDataType;
	};

	type JustUserDataType = {
		id: string;
		email: string?;
		name: string;
		login: string;
		image: string;
		roleTag: string;
		class: string?;
	};

	type UserDataType = {
		id: string;
		email: string?;
		name: string;
		login: string;
		image: string;
		role: RoleDataType;
		roleTag: string;
		class: string?;
	};

	type SessionDataType = {
		id: string;
		sessionToken: string;
		userId: string;
		user: UserDataType;
		expires: string;
	};

	type RoleDataType = {
		tag: string;
		name: string;

		createPosts: boolean;
		publishPosts: boolean;
		managePosts: boolean;
		manageUsers: boolean;
		manageEvents: boolean;
		manageCalendar: boolean;
		manageNumbers: boolean;
		manageNotifications: boolean;
		managePages: boolean;
		addAnnouncements: boolean;
		manageAnnouncements: boolean;
		manageRoles: boolean;
		manageTeachers: boolean;
	};

	type JustDayDataType = {
		date: string;
		number: ?number;
		freeDay: boolean;
		day: number;
		month: number;
		year: number;
		timeStamp: Date;
	};

	type DayDataType = {
		date: string;
		number: ?number;
		freeDay: boolean;
		day: number;
		month: number;
		year: number;
		timeStamp: Date;
		events: EventDataTypeWithPost[];
		announcements: JustAnnouncementDataType[];
	};

	type EventDataType = {
		id: string;
		createdAt: Date;
		name: string;
		description: ?string;
		date: string;
		tags: EventTagDataType[];
		authorId: string;
	};

	type EventDataTypeWithAuthor = {
		id: string;
		createdAt: Date;
		name: string;
		description: ?string;
		date: string;
		tags: EventTagDataType[];
		authorId: string;
		author: JustUserDataType;
	};

	type EventDataTypeWithPost = {
		id: string;
		createdAt: Date;
		name: string;
		description: ?string;
		date: string;
		tags: EventTagDataType[];
		authorId: string;
		post: ?JustPostDataType;
	};

	type EventTagDataType = {
		id: string;
		createdAt: Date;
		name: string;
		color: string;
		authorId: string;
	};

	type JustNotificationDataType = {
		id: string;
		createdAt: Date;
		title: string;
		content: string;
		authorId: string;
		pinned: boolean;
	};

	type NotificationDataType = {
		id: string;
		createdAt: Date;
		title: string;
		content: string;
		authorId: string;
		author: JustUserDataType;
		pinned: boolean;
	};

	type RouteDataType = {
		id: string;
		name: string;
		link: string;
		createdAt: Date;
		category: RouteCategoryDataType;
		index: number;
	};

	type RouteCategoryDataType = "school" | "student" | "parents" | "recruitation" | "exam" | "lot" | "trips" | "docs";

	type JustAnnouncementDataType = {
		id: string;
		createdAt: Date;
		content: string;
		days: JustDayDataType[];
		authorId: string;
		published: boolean;
	};
	type AnnouncementDataType = {
		id: string;
		createdAt: Date;
		content: string;
		days: JustDayDataType[];
		authorId: string;
		author: JustUserDataType;
		published: boolean;
		publishedBy: ?JustUserDataType;
	};
}

type TeacherDataType = {
	id: string;
	createdAt: Date;
	title: string?;
	name: string;
	lastName: string;
	email: string?;
	image: string;
	description: string?;
	subjects: string[];
	class: string?;
};

type ResetToken = {
	token: string;
	createdAt: Date;
	login: string;
	email: string;
};
