"use client"
import Loader from '@/components/Loader'
import NestedNav, { NavLink } from '@/components/NestedNav'
import SmallLoader from '@/components/SmallLoader'
import useAuthStore from '@/lib/zustand'
import { getLectures} from '@/util/client/helpers'
import { Lecture} from '@prisma/client'
import Link from 'next/link'
import { getAllResources } from '@/util/client/helpers'
import { Resources } from '@prisma/client'
import {useEffect, useState} from 'react'

type ClassCardProps = {
	item: Lecture
}

const Page = ({params: {classroomId}}: {params: {classroomId: string}}) => {
	
	
	const {user} = useAuthStore()
	const [data, setData] = useState<Resources[]>([]);

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const quizzes = await getAllResources(user.userOrgId, classroomId)
			if (quizzes) setData(quizzes)
		}
		getData()
	}, [user])

	
	const navlinks: NavLink[] = [
		{
			href: `/student/classrooms/${classroomId}/lectures`,
			title: "Lectures"
		},
		{
			href: `/student/classrooms/${classroomId}/quiz`,
			title: "Quizzes"
		},
		{
			href: `/student/classrooms/${classroomId}/notes`,
			title: "Notes"
		},
        {
            href: `/student/classrooms/${classroomId}/resources`,
			title: "Resources"
        }
	
	]
	const ResourceCard = ({item}: {item: Resources}) => {
        
		return (
			<Link href={`/student/classrooms/${classroomId}/quiz/${item.quizId}`} className='quizCard | rounded-[0.625rem] border border-[#A0A0A0] text-center px-6 py-7'>
        <h1 className='text-xl text-black'>{item.quizName}</h1>
        <p className='mt-3'>Tap to reveal answers</p>
        <div className='mt-3 flex gap-3 flex-wrap justify-center'>
          <p className='text-sm text-[#0039C6] border border-[#5462DF] bg-[#CCE0FF] font-medium py-[0.375rem] px-3 rounded-full'>Download</p>
          <p className='text-sm text-[#00802B] border border-[#00B833] bg-[#CCFFE0] font-medium py-[0.375rem] px-3 rounded-full'>Share7</p>
        </div>
      </Link>
		)
	}
  return (
    <div className=' flex flex-col gap-2'>
			<NestedNav items={navlinks} button={(<></>)}/>  
	<div>
    <h1 className='text-4xl text-black font-medium'>Resources</h1>
    <div className='quizCardWrapper | mt-3 grid gap-10 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'>
      {data.map((item) => (<ResourceCard item={item} key={item.quizId}/>))}
    </div>
	</div>
    </div>
  )
}

export default Page

