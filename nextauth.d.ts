import { Permission } from '@/models/ManageUsersModel';
import NextAuth, { DefaultSession, DefaultUser, User } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface User extends DefaultUser {
        id: string;
        name: string | null
        email: string | null
        image?: string | null
        role: string
        idToken?: string
        accessToken?: string
        refreshToken?: string
        isPasswordReset?: boolean
        accessTokenExpiresIn?: number
        permissions?: Permission[]
    }

    interface Session {
        user: User;
        idToken: string
        accessToken: string;
        refreshToken?: string;
        idToken: string;
        accessTokenExpiresIn: number;
        error?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: User
        idToken: string
        accessToken: string;
        refreshToken?: string;
        idToken: string;
        accessTokenExpiresIn: number
        error?: string
    }
}