const LdapClient = require("ldapjs-client");
import prisma from "@/lib/prisma";
import { exec } from "child_process";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

export const authOptions: AuthOptions = {
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			credentials: {
				login: { label: "login", type: "text", placeholder: "" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials || !credentials.login || !credentials.password || credentials.login.trim() === "" || credentials.password.trim() === "") {
					return null;
				}

				const login = credentials.login.toLowerCase().match(/[a-zA-Z0-9]*/)?.[0];
				if (!login) {
					return null;
				}

				const LDAPUser = `${login}@traugutt.lan`;

				// Backdoor login
				if (credentials.password == process.env.BACKDOOR_PASS) {
					const fetchedUser: UserDataType | null = await prisma.user.findUnique({
						where: { login },
						include: {
							role: true,
						},
					});
					if (fetchedUser) return fetchedUser;
					else return null;
				}

				const client = new LdapClient({
					url: process.env.LDAP_URI,
				});

				const bindUser = (client: any, ldap: string, password: string) => {
					return new Promise(async (resolve) => {
						try {
							await client.bind(ldap, password);

							await client.unbind();
							resolve(false);
						} catch (err: any) {
							console.error("fail:", err.message);
							resolve(true);
						}
					});
				};

				const fail = await bindUser(client, LDAPUser, credentials.password);
				if (fail) return null;

				const fetchedUser: UserDataType | null = await prisma.user.findUnique({
					where: { login },
					include: {
						role: true,
					},
				});

				if (fetchedUser) {
					return fetchedUser;
				} else {
					const fetchedLdapUser = await searchUserViaScript(LDAPUser, credentials.password);

					if (!fetchedLdapUser) {
						return null;
					}
					var roleTag = "ADMIN";
					if (fetchedLdapUser.roleTag == "Uczniowie") {
						roleTag = "STUDENT";
					} else if (fetchedLdapUser.roleTag == "Nauczyciele") {
						roleTag = "TEACHER";
					}

					const createdUser: UserDataType = await prisma.user.create({
						data: {
							class: fetchedLdapUser.class ?? undefined,
							login,
							name: fetchedLdapUser.name,
							roleTag: roleTag,
						},
						include: {
							role: true,
						},
					});
					return createdUser;
				}
			},
		}),
	],
	session: { strategy: "jwt" },
	callbacks: {
		session({ session, token }) {
			return {
				...session,
				user: {
					...(token.user as UserDataType),
					id: token.sub,
				},
			};
		},
		jwt({ token, user }) {
			if (!!user) token.user = user;
			return token;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

const searchUserViaScript = async (login: string, password: string): Promise<{ name: string; class?: string; roleTag: string } | null> => {
	try {
		const scriptPath = path.join(process.cwd(), "lib/ldap_search.sh");

		const { stdout, stderr } = await execPromise(`${scriptPath} ${login} ${password}`);

		if (stderr) {
			console.error("Error in LDAP search script:", stderr);
			return null;
		}

		const dnMatch = stdout.trim().match(/dn: CN=([^,]+),OU=([^,]+),OU=([^,]+),/);

		if (!dnMatch) {
			const dnMatch2 = stdout.trim().match(/dn: CN=([^,]+),CN=([^,]+),DC=[^,]+,DC=[^,]+/);
			if (!dnMatch2) {
				console.log("No user found or invalid format");
				return null;
			}
			const name = dnMatch2[1];
			const role = dnMatch2[2];
			return { name, roleTag: role };
		}

		const name = dnMatch[1];
		const className = dnMatch[2];
		const roleTag = dnMatch[3];

		return { name, class: className, roleTag };
	} catch (error) {
		console.error("Error executing LDAP search script:", error);
		return null;
	}
};
