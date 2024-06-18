import { refreshToken, signIn } from "@/services/AuthService";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: JWT) {
    try {
        if (!token?.refreshToken) {
            throw token;
        }
        const refreshedTokens: any = await refreshToken(token.refreshToken ?? "", token.idToken ?? "");
        if (!refreshedTokens?.data?.accessToken) {
            throw refreshedTokens;
        }
        return {
            ...token,
            accessToken: refreshedTokens?.data?.accessToken,
            idToken: refreshedTokens?.data?.idToken ?? token.idToken,
            accessTokenExpiresIn: refreshedTokens?.data?.accessTokenExpiresIn ?? token.accessTokenExpiresIn,
        };
    } catch (error) {
        console.log("refreshToken", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const response = (await signIn({ username: credentials?.username ?? "", password: credentials?.password ?? "" }))?.data;
                    return {
                        id: response.user.id,
                        name: response.user.name,
                        email: response.user.email,
                        role: response.user.roleName,
                        isPasswordReset: response.user.isPasswordReset,
                        accessToken: response.accessToken,
                        idToken: response.idToken,
                        refreshToken: response.refreshToken,
                        accessTokenExpiresIn: response.accessTokenExpiresIn,
                        permissions: response.user.permissions,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isPasswordReset: user.isPasswordReset,
                    permissions: user.permissions ?? [],
                };
                token.accessToken = user.accessToken ?? "";
                token.idToken = user.idToken ?? "";
                token.refreshToken = user.refreshToken ?? undefined;
                token.accessTokenExpiresIn = user.accessTokenExpiresIn ? Date.now() + user?.accessTokenExpiresIn * 1000 : 0;
            }
            if (Date.now() < token.accessTokenExpiresIn) {
                return token;
            }

            return refreshAccessToken(token);
        },
        session: ({ session, token }) => {
            if (token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
                session.idToken = token.idToken;
                session.refreshToken = token?.refreshToken;
                session.error = token?.error;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
