"use client"

import {useRouter} from "next/navigation";

export default function PageNotFound() {
	const router = useRouter()

	router.push("/")

	return (
		null
	)
}