"use client"
import useAuthStore from "@/lib/zustand"
import { UserType } from "@prisma/client"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function RoleChecker({role}:{role:UserType}) {
    const { user } = useAuthStore()

    useEffect(() => {
        if (user) {
            if(user.userType!==role){
                redirect("/")
            }
        }
    }, [user])

    return (
        <></>
    )
}
