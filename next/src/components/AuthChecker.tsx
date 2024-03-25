"use client"
import useAuthStore from "@/lib/zustand"
import { NoParams } from "@/util/api/api_requests"
import { GetUserResponse } from "@/util/api/api_responses"
import { makeAPIRequest } from "@/util/client/helpers"
import { UserType } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function AuthChecker() {
    const { auth, setAuth, user, authenticate } = useAuthStore()
    const path = usePathname()
    const router = useRouter()

    const roleRoute = (role: UserType) => {
        if(role==="Administrator")return "/admin";
        if(role==="Student")return "/student";
        if(role==="Teacher")return "/teacher";
    }

    const getUser = async () => {
        const response = await makeAPIRequest<GetUserResponse, NoParams, NoParams>({
            requestUrl: "/api/me",
            urlParams: {},
            bodyParams: {},
            queryParams: {},
            requestMethod: "GET"
          })
          const {hasResponse, responseData} = response
          console.log("getUser response: ",response)
        if(hasResponse&&responseData.responseStatus==="SUCCESS"){
            if(responseData.isAuthenticated){
                authenticate(responseData.authenticatedUser)
                console.log("Authenticated user: ",responseData.authenticatedUser)
                toast.success("Welcome back, "+responseData.authenticatedUser.userName+"!")
                setAuth(true)
                return;
            }
        }
        if(path!="/login"&&path!="/"){
            toast.warning("Please login to continue!")
            router.push("/login")
        }
    }

    useEffect(() => {
        if (!user) {
            getUser()
        }else{
            if(path==="/login"){
                console.log("router.pushing to "+roleRoute(user.userType)+"/")
                router.push(`${roleRoute(user.userType)}/`)
            }
            if(!auth)setAuth(true)
        }
    }, [path, user, auth])

    return (
        <></>
    )
}
