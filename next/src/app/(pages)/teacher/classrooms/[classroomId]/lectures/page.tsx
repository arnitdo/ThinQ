"use client"
import Loader from '@/components/Loader'
import SmallLoader from '@/components/SmallLoader'
import useAuthStore from '@/lib/zustand'
import { deleteLecture, getLectures} from '@/util/client/helpers'
import {AuthUser} from '@/util/middleware/auth'
import { ClassroomEnrollment, Lecture} from '@prisma/client'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import Form from './(components)/Form'
import { toast } from 'sonner'
import { get } from 'http'

type ClassCardProps = {
	item: Lecture
}

const Page = ({params: {classroomId}}: {params: {classroomId: string}}) => {
	const {user} = useAuthStore()
	const [data, setData] = useState<Lecture[]>([]);
	const [create, setCreate] = useState<boolean>(false)

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const lectures = await getLectures(user.userOrgId, classroomId)
			if (lectures) setData(lectures)
		}
		if(!create)
		getData()
	}, [user, create])


	const ClassCard = ({item}: ClassCardProps) => {
		const [faculty, setFaculty] = useState<AuthUser | null>(null)
		const [enrollments, setEnrollments] = useState<ClassroomEnrollment[] | null>(null)
	  const [able, setAble] = useState(false)
	  const handleClick = ()=>{
		setAble(!able)
	  }

	  function getStringDate(start: Date | string | number, end: Date | string | number) {
        let date = (new Date(start)).toLocaleDateString().toString();
        return date;
    }

	function getStringTime(start: Date | string | number) {
		let time = (new Date(start)).toLocaleTimeString().toString();
		return time;
	}


	
	  console.log({start:item.lectureStartTimestamp, end:item.lectureEndTimestamp})
		// useEffect(() => {
		// 	const getClassData = async () => {
		// 		const faculty = await getFaculty(item.classroomOrgId, item.facultyUserId)
		// 		if (faculty) setFaculty(faculty)
		// 		const enrollments = await getEnrollments(item.classroomOrgId, item.classroomId)
		// 		if (enrollments) setEnrollments(enrollments)
		// 	}
		// 	getClassData()
		// }, [item.facultyUserId])
	
		async function handleDelete(lectureId: string) {
			if(!user)return
			setData(data.filter((item) => item.lectureId !== lectureId))
			const res = await deleteLecture(user.userOrgId, classroomId, lectureId)
			if(res)toast.success("Classroom deleted successfully!")
		}
	
		return (
			<div key={item.lectureId} className=' border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all'>
				<div
					className='h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center'>
					<div className=' px-4 py-3 bg-blue-50 rounded-md'>
						<h1 className='text-blue-600 font-bold text-xl'>{item.title.slice(0, 2).toUpperCase()}</h1>
					</div>
					<h1 className='text-white text-2xl max-sm:text-xl'>{item.title}</h1>
					<img src="/dots.svg" alt="" className='cursor-pointer'
						 onClick={handleClick}/>
				</div>
				<div className='p-4'>
					{
					able && (
						<div className='bg-white h-fit w-44 p-4 border -mt-6 rounded-md shadow-2xl absolute ml-28'>
							<div className='p-2 hover:bg-gray-200 rounded-sm cursor-pointer'>Edit</div>
							<div onClick={()=>{
								handleDelete(item.lectureId)
								}} className='p-2 text-red-800 hover:bg-red-100 rounded-sm cursor-pointer'>Delete</div>
						</div>
					)
					}
					<div className=' flex flex-col gap-2 '>
					<h1 className='text-[#6C6C6C] flex flex-row justify-start items-center'>Class
						Scheduled at: <span className='font-semibold px-2'>{getStringDate(item.lectureStartTimestamp, item.lectureEndTimestamp)}</span></h1>
						<div className=' flex flex-row gap-4 justify-start items-center'>
							<div className=' py-1 px-3 rounded-full bg-primary text-white font-semibold text-ms'>
								{getStringTime(item.lectureStartTimestamp)}
							</div>
							<h1 className=' font-bold text-xl text-zinc-950'>-</h1>
							<div className=' py-1 px-3 rounded-full bg-secondary text-white font-semibold text-md'>
								{getStringTime(item.lectureEndTimestamp)}
							</div>
						</div>
						</div>
					<h1 className='text-[#6C6C6C] mt-20 flex justify-start'>
						Attendee:
						<img src="/attendee.svg" alt=""
							 className='ml-2'/> +{enrollments ? (enrollments.length) :
						<span><SmallLoader/></span>}
					</h1>
				</div>
	
			</div>
		)
	}

	return (
		<>
			<div className="flex justify-between items-end border-b pb-2">
				<nav className="font-medium p-2 flex gap-[1.875rem] max-sm:gap-3 max-sm:text-sm">
					<Link href={`/teacher/classrooms/${classroomId}/lectures`}
					      className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">Lectures</Link>
					<Link href={`/teacher/classrooms/${classroomId}/quiz`} className="">
						Quizzes
					</Link>
					<Link href={`/teacher/classrooms/${classroomId}/notes`} className="">Notes</Link>
				</nav>
				<button
					className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]" onClick={()=>setCreate(true)}
				>
					{/* onClick function left to add on this button, present in /teachers */}
					+ Create
				</button>
			</div>
			{create && (
				<Form create={create} setCreate={setCreate} classroomId={classroomId}/>
			)}

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

