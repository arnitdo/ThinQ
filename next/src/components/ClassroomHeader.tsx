"use client";

import useAuthStore from "@/lib/zustand";
import { getClassroom } from "@/util/client/helpers";
import { Classroom } from "@prisma/client";
import { ArrowLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { roleRoute } from "./AuthChecker";
import Link from "next/link";

export default function ClassroomHeader({classroomId} : {classroomId: string}) {
    const [classroom, setClassroom] = useState<Classroom>()
    const { user } = useAuthStore()
    useEffect(() => {
      const getData = async() => {
        if(!user) return
        const response = await getClassroom(user.userOrgId, classroomId)
        if(response)
        setClassroom(response)
      }
      getData()
    }, [user])

  return classroom?(
    <header
        className='font-medium p-[1.125rem] max-sm:p-2 border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-start gap-4 mb-4 bg-white'>
            <Link href={`${user?roleRoute[user.userType]:""}/classrooms`}><ArrowLeftCircle/></Link>
        <h1 className='text-xl  max-sm:text-lg underline decoration-slate-950'>{classroom?.classroomName}</h1>
    </header>
  ):(<></>)
}
