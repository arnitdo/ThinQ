"use client"
import NestedNav, {NavLink} from '@/components/NestedNav'
import useAuthStore from '@/lib/zustand'
import {getAllResources} from '@/util/client/helpers'
import {ClassroomResource} from '@prisma/client'
import {useEffect, useState} from 'react'
import {toast} from "sonner";

type ResourceData = Omit<ClassroomResource, "resourceObjectKey"> & {
	resourceUrl: string
}

const ResourceCard = ({item}: { item: ResourceData }) => {
	return (
		<div className='quizCard | rounded-[0.625rem] border border-[#A0A0A0] text-center px-6 py-7'>
			<h1 className='text-xl text-black'>{item.resourceName}</h1>
			<div className='mt-3 flex gap-3 flex-wrap justify-center'>
				<a className='text-sm text-[#0039C6] border border-[#5462DF] bg-[#CCE0FF] font-medium py-[0.375rem] px-3 rounded-full' href={item.resourceUrl} download>Download</a>
				<p className='cursor-pointer text-sm text-[#00802B] border border-[#00B833] bg-[#CCFFE0] font-medium py-[0.375rem] px-3 rounded-full' onClick={() => {
					navigator.clipboard.writeText(item.resourceUrl)
					toast.success("Link copied to clipboard!")
				}}>Share</p>
			</div>
		</div>
	)
}

const Page = ({params: {classroomId}}: { params: { classroomId: string } }) => {


	const {user} = useAuthStore()
	const [data, setData] = useState<ResourceData[]>([]);

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const quizzes = await getAllResources(user.userOrgId, classroomId)
			if (quizzes) {
				setData(quizzes)
			}
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

	return (
		<div className=' flex flex-col gap-2'>
			<NestedNav items={navlinks} button={(<></>)}/>
			<div>
				<h1 className='text-4xl text-black font-medium'>Resources</h1>
				<div className='quizCardWrapper | mt-3 grid gap-10 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'>
					{data.map((item) => (<ResourceCard item={item} key={item.resourceId}/>))}
				</div>
			</div>
		</div>
	)
}

export default Page

