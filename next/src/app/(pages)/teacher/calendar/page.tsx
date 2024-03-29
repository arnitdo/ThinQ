"use client"
import Link from "next/link"

import useAuthStore from "@/lib/zustand"
import { getTeacherCalender } from "@/util/client/helpers"
import { Lecture } from "@prisma/client"
import { useEffect, useState } from "react"

export default function Page() {
    const [data, setData] = useState<Lecture[]>([])
    const { user } = useAuthStore()

    useEffect(() => {
        const getData = async () => {
            const response = await getTeacherCalender(user!.userOrgId)
            if(response)
            setData(response)
        }
        if(user)
        getData()
    }, [user])
    
  return (
    <>
        <div className="p-6 border border-[#8C8C8C] rounded-[0.5rem]">
          <div className="flex justify-between items-center mb-7 out">
            <div>
              <p className="text-xs font-medium text-[#7E7E7E]">Today</p>
              <div className="flex gap-4">
                <h2 className="text-[1.75rem] font-medium text-[#575757]">Fri, March 29</h2>
                <div className="dayChangeButtons flex">
                  <button className="py-1 px-[0.3125rem] bg-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,85%)] rounded-[0.5rem_0_0_0.5rem]">
                    <img src="/calendarDayNavigation.svg" alt="" />
                  </button>
                  <button className="py-1 px-[0.3125rem] bg-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,85%)] rounded-[0_0.5rem_0.5rem_0]">
                    <img src="/calendarDayNavigation.svg" alt="" className="rotate-180"/>
                  </button>
                </div>
              </div>
            </div>

            <label htmlFor="calendarDatePicker" className="calendarIcon | bg-[#E0E0E0] p-[0.625rem] rounded-[0.5rem]">
              <img src="/sidebarCalendar.svg" alt="" />
            </label>
          </div>

          <div>
            <div className="lectureCardContainer">
              <p className="flex gap-1 text-xs font-medium text-[#7E7E7E] mb-2">
                <span className="lectureStartTime">5:00 pm</span>
                -
                <span className="lectureEndTime">6:00 pm</span>
              </p>
              <div className="lectureCard | grid hover:gap-[0.9375rem] grid-cols-[0_1fr] hover:grid-cols-[0.5rem_1fr] transition-[grid-template-columns]">
                <div className="lectureCardActiveBar | bg-primary rounded-full"></div>
                <div className="p-[0.9375rem] border border-[#7C7A7A] rounded-[0.3125rem] bg-[hsl(0,0%,95%,20%)] shadow-[0_8px_15.1px_hsl(0,1%,25%,10%)] flex justify-between items-center">
                  <div>
                    <div className="lectureClass | text-secondary text-[0.5rem] font-bold bg-[hsl(318,93%,55%,14%)] border border-secondary py-[0.3125rem] px-[0.6875rem] rounded-full w-max mb-2">Comp-3</div>
                    <h2 className="text-xl font-medium text-black">Linear Algebra</h2>
                    <h3 className="text-[0.9375rem] text-[#A1A1A1]">Faculty: <span>Prinkal Doshi</span></h3>
                  </div>
                  <Link href={"/"} className="px-[1.375rem] py-[0.375rem] rounded-full border border-[#9F9F9F] bg-white text-sm font-medium text-[#6F6F6F]">
                    <button className="">Join <span className="text-[#9F9F9F]">{">"}</span></button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}
