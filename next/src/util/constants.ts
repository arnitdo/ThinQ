export const AUTH_COOKIE_NAME = "auth-token"

export const FALLBACK_JWT_SECRET = "maam-fallback-jwt-secret"

export const ENABLE_REQUEST_LOGGING = true

export const EPOCH_DATE_FMT = new Date(0).toUTCString()

export const COOKIE_OPTS = "HttpOnly; path=/; " + (
	process.env.NODE_ENV === "production" ? "Secure" : ""
)