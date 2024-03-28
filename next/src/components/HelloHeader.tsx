"use client"
import useAuthStore from "@/lib/zustand"

export default function HelloHeader() {
    const {user} = useAuthStore()
    return user?(
        <header
            className='font-medium p-[1.125rem] max-sm:p-2 border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-between mb-4 bg-white'>
            <h1 className='text-xl  max-sm:text-lg'>Hello  {user?user.userType+" 👋, "+user.userDisplayName:""}</h1>
            <div className='flex gap-6'>
                <div className="ignoreThisDiv line | border"></div>
                <div
                    className='grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]'>{user?user.userDisplayName[0].toUpperCase():" "}
                </div>
            </div>
        </header>
    ):(
        <></>
    )
}
