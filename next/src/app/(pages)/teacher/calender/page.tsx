"use client"

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
    <div>
        <div className=" p-2 flex flex-col gap-2 ">
            <h1 className="text-2xl font-bold">Calender</h1>
            <div className="flex flex-col gap-2">
                {data.map((item) => (
                    <div key={item.lectureId} className="bg-white p-2 rounded-md text-zinc-950 shadow-md">
                        <h1 className="text-lg font-bold">{item.title}</h1>
                        <p className="text-sm">{item.lectureStartTimestamp.toLocaleString()}</p>
                        <p className="text-sm">{item.lectureEndTimestamp.toLocaleString()}</p>
                        <p className="text-sm">{item.lectureClassroomId}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
