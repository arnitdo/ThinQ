"use client"
import useAuthStore from "@/lib/zustand"
import { NoParams } from "@/util/api/api_requests"
import { GetUserResponse } from "@/util/api/api_responses"
import { makeAPIRequest } from "@/util/client/helpers"
import { UserType } from "@prisma/client"
import { redirect, usePathname } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function AuthChecker() {
    const { user, authenticate } = useAuthStore()
    const path = usePathname()

    const roleRoute = (role: UserType) => {
        if(role==="Administrator")return "/admin";
        if(role==="Student")return "/student";
        if(role==="Teacher")return "/teacher";
    }

    const getUser = async () => {
        const {responseData, hasResponse} = await makeAPIRequest<GetUserResponse, NoParams, NoParams>({
            requestUrl: "/api/me",
            urlParams: {},
            bodyParams: {},
            queryParams: {},
            requestMethod: "GET"
          })
        if(hasResponse&&responseData.responseStatus==="SUCCESS"){
            if(responseData.isAuthenticated){
                authenticate(responseData.authenticatedUser)
                toast.success("Welcome back, "+responseData.authenticatedUser.userName+"!")
                return;
            }
        }
        if(path!="/login"&&path!="/"){
            toast.warning("Please login to continue!")
            redirect("/login")
        }
    }

    useEffect(() => {
        if (!user) {
            getUser()
        }else{
            if(path==="/login"){
                console.log("redirecting to "+roleRoute(user.userType)+"/")
                redirect(`${roleRoute(user.userType)}/`)
            }
        }
    }, [path, user])

    return (
        <></>
    )
}
