import type {User} from "@prisma/client"

export type AuthUser = Omit<User, "userPassword">
