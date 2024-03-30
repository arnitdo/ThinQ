"use client"
import Loader from '@/components/Loader'
import NestedNav, {NavLink} from '@/components/NestedNav'
import useAuthStore from '@/lib/zustand'
import {getAllNotes} from '@/util/client/helpers'
import {Notes} from '@prisma/client'
import Link from 'next/link'
import {useEffect, useState} from 'react'

type ClassCardProps = {
	item: Notes
}

const Page = ({params: {classroomId}}: {params: {classroomId: string}}) => {
	const {user} = useAuthStore()
	const [data, setData] = useState<Notes[]>([]);

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const notes = await getAllNotes(user.userOrgId, classroomId)
			if (notes) setData(notes)
		}
		getData()
	}, [user])

	const ClassCard = ({item}: ClassCardProps) => {
	
		return (
			<Link href={`/teacher/classrooms/${classroomId}/notes/${item.lectureId}`} key={item.lectureId} className=' border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all'>
				<div
					className='h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center'>
					<div className=' px-4 py-3 bg-blue-50 rounded-md'>
						<h1 className='text-blue-600 font-bold text-xl'>{item.notesTitle.slice(0, 2).toUpperCase()}</h1>
					</div>
					<h1 className='text-white text-2xl max-sm:text-xl'>{item.notesTitle}</h1>
					<div></div>
				</div>
				<div className='p-4'>
					<h1 className='text-[#6C6C6C] flex text-sm flex-row justify-start items-center'>
						Content : {item.notesContent.slice(0, 50)}{item.notesContent.length > 50 ? "..." : ""}
					</h1>
				</div>
	
			</Link>
		)
	}
	
	const navlinks : NavLink[] = [
		{
			href: `/teacher/classrooms/${classroomId}/lectures`,
			title: "Lectures"
		},
		{
			href: `/teacher/classrooms/${classroomId}/quiz`,
			title: "Quizzes"
		},
		{
			href: `/teacher/classrooms/${classroomId}/notes`,
			title: "Notes"
		},
		{
			href: `/teacher/classrooms/${classroomId}/assessments`,
			title: "Assessments"
		},
		{
			href: `/teacher/classrooms/${classroomId}/resources`,
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

