"use client"
import Loader from '@/components/Loader'
import NestedNav, { NavLink } from '@/components/NestedNav'
import SmallLoader from '@/components/SmallLoader'
import useAuthStore from '@/lib/zustand'
import { getLectures} from '@/util/client/helpers'
import { Lecture} from '@prisma/client'
import Link from 'next/link'
import {useEffect, useState} from 'react'

type ClassCardProps = {
	item: Lecture
}

const Page = ({params: {classroomId}}: {params: {classroomId: string}}) => {
	const {user} = useAuthStore()
	const [data, setData] = useState<Lecture[]>([]);

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const lectures = await getLectures(user.userOrgId, classroomId)
			if (lectures) setData(lectures)
		}
		getData()
	}, [user])

	const ClassCard = ({item}: ClassCardProps) => {
	
		return (
			<Link href={`/student/classrooms/${classroomId}/notes/${item.lectureId}`} key={item.lectureId} className=' border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all'>
				<div
					className='h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center'>
					<div className=' px-4 py-3 bg-blue-50 rounded-md'>
						<h1 className='text-blue-600 font-bold text-xl'>{item.title.slice(0, 2).toUpperCase()}</h1>
					</div>
					<h1 className='text-white text-2xl max-sm:text-xl'>{item.title}</h1>
					<div></div>
				</div>
				<div className='p-4'>
					<h1 className='text-[#6C6C6C] flex flex-row justify-start items-center'>Class
						Faculty: {user ? user.userDisplayName : <span><SmallLoader/></span>}</h1>
					<h1 className='text-[#6C6C6C] mt-20 flex justify-start'>
						Attendee:
						<img src="/attendee.svg" alt=""
							 className='ml-2'/> +4 
					</h1>
				</div>
	
			</Link>
		)
	}

	
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
	return (
		<>
			<NestedNav items={navlinks} button={(<></>)}/>

			<main className='py-4'>
				<div className='grid grid-cols-3 gap-3 max-sm:grid-cols-1 max-[1000px]:grid-cols-2'>
					{data.length === 0 ?
						(
							// relative to rightWrapper
							<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
								<Loader/>
							</div>
						) : (
							data.map((item) => {
                                return (
                                    <ClassCard
                                        key={item.lectureId}
                                        item={item}
                                    />
                                )
						}))}
				</div>
			</main>
		</>
	)
}

export default Page

