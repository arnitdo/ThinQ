// Write your API Responses here
import type {Organization} from "@prisma/client";
import {AuthUser} from "@/util/middleware/auth";

export type GetOrgsResponse = {
	allOrgs: Organization[]
}

export type GetUserResponse = {
	isAuthenticated: true,
	authenticatedUser: AuthUser
} | {
	isAuthenticated: false,
	authenticatedUser: null
}

export type AuthSignupUserResponse = {} & AuthUser