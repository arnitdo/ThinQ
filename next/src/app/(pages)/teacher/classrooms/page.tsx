"use client"
import Loader from '@/components/Loader'
import SmallLoader from '@/components/SmallLoader'
import useAuthStore from '@/lib/zustand'
import {deleteClassroom, getClassrooms, getEnrollments, getFaculty, getFacultyClassrooms} from '@/util/client/helpers'
import {AuthUser} from '@/util/middleware/auth'
import {Classroom, ClassroomEnrollment} from '@prisma/client'
import { get } from 'http'
import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'
import { toast } from 'sonner'
import {motion} from 'framer-motion'
type ClassCardProps = {
	item: Classroom
}

const Page = () => {
	const {user} = useAuthStore()
	const [data, setData] = useState<Classroom[]>([]);
	const [clickedCardId, setClickedCardId] = useState<string | null>(null)
	const [create, setCreate] = useState<boolean>(false)

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const classrooms = await getFacultyClassrooms(user.userOrgId)
			console.log(classrooms)
			if (classrooms) setData(classrooms)
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
	
		useEffect(() => {
			const getClassData = async () => {
				const faculty = await getFaculty(item.classroomOrgId, item.facultyUserId)
				if (faculty) setFaculty(faculty)
				const enrollments = await getEnrollments(item.classroomOrgId, item.classroomId)
				if (enrollments) setEnrollments(enrollments)
			}
			getClassData()
		}, [item.facultyUserId])
		return (
			<Link href={`/teacher/classrooms/${item.classroomId}/lectures`} key={item.classroomId} className='outline border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all'>
				<div
					className='h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center'>
					<div className=' px-4 py-3 bg-blue-50 rounded-md'>
						<h1 className='text-blue-600 font-bold text-xl'>{item.classroomName.slice(0, 2).toUpperCase()}</h1>
					</div>
					<h1 className='text-white text-2xl max-sm:text-xl'>{item.classroomName}</h1>
					{/* <img src="/dots.svg" alt="" className='cursor-pointer'
						 onClick={handleClick}/> */}
						 <div></div>
				</div>
				<div className='p-4'>
					{
					//  able && (
					// 	<div className='bg-white h-fit w-44 p-4 border -mt-6 rounded-md shadow-2xl absolute ml-28'>
					// 		<div className='p-2 hover:bg-gray-200 rounded-sm cursor-pointer'>Edit</div>
					// 		<div onClick={()=>handleDelete(item.classroomId)} className='p-2 text-red-800 hover:bg-red-100 rounded-sm cursor-pointer'>Delete</div>
					// 	</div>
					// )
					}
					<h1 className='text-[#6C6C6C] flex flex-row justify-start items-center'>Class
						Incharge: {faculty ? faculty.userDisplayName : <span><SmallLoader/></span>}</h1>
					<h1 className='text-[#6C6C6C] mt-20 flex justify-start'>
						Attendee:
						<img src="/attendee.svg" alt=""
							 className='ml-2'/> +{enrollments ? (enrollments.length) :
						<span><SmallLoader/></span>}
					</h1>
				</div>
	
			</Link>
		)
	}
	


	const handleClick = (id: any) => {
		if (clickedCardId === id) {
			setClickedCardId(null); // Toggle off if already clicked
		} else {
			setClickedCardId(id);
		}
	};

	return (
		<>
			<div className="flex justify-between items-end border-b pb-2">
				<nav className="font-medium p-2 flex gap-[1.875rem] max-sm:gap-3 max-sm:text-sm">
					<Link href="/teacher/classrooms"
					      className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">Classrooms</Link>
					{/* <Link href="/teacher/teachers" className="">
						Teachers
					</Link>
					<Link href="/teacher/students" className="">Students</Link> */}
				</nav>
				{/* <button
					className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]" onClick={()=>setCreate(true)}
				>
					+ Create
				</button> */}
			</div>
			{/* {create && (
				<Form create={create} setCreate={setCreate}/>
			)} */}

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
                                        key={item.classroomId}
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