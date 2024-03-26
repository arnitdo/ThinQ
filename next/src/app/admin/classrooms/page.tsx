"use client"
import Loader from '@/components/Loader'
import SmallLoader from '@/components/SmallLoader'
import useAuthStore from '@/lib/zustand'
import {getClassrooms, getEnrollments, getFaculty} from '@/util/client/helpers'
import {AuthUser} from '@/util/middleware/auth'
import {Classroom, ClassroomEnrollment} from '@prisma/client'
import Link from 'next/link'
import {useEffect, useState} from 'react'

type ClassCardProps = {
	item: Classroom,
	activeId: string | null,
	setActive: (classId: string) => void
}

const ClassCard = ({item, activeId, setActive}: ClassCardProps) => {
	const [faculty, setFaculty] = useState<AuthUser | null>(null)
	const [enrollments, setEnrollments] = useState<ClassroomEnrollment[] | null>(null)
  const [able, setAble] = useState(false)
  const handleClick = ()=>{
    setActive(item.classroomId)
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
		<div key={item.classroomId} className=' border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all'>
			<div
				className='h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center'>
				<div className=' px-4 py-3 bg-blue-50 rounded-md'>
					<h1 className='text-blue-600 font-bold text-xl'>{item.classroomName.slice(0, 2).toUpperCase()}</h1>
				</div>
				<h1 className='text-white text-2xl max-sm:text-xl'>{item.classroomName}</h1>
				<img src="/dots.svg" alt="" className='cursor-pointer'
				     onClick={handleClick}/>
			</div>
			<div className='p-4'>
				{activeId === item.classroomId && able && (
					<div className='bg-white h-fit w-44 p-4 border -mt-6 rounded-md shadow-2xl absolute ml-28'>
						<div className='p-2 hover:bg-gray-200 rounded-sm cursor-pointer'>Edit</div>
						<div className='p-2 text-red-800 hover:bg-red-100 rounded-sm cursor-pointer'>Delete</div>
					</div>
				)}
				<h1 className='text-[#6C6C6C] flex flex-row justify-start items-center'>Class
					Incharge: {faculty ? faculty.userDisplayName : <span><SmallLoader/></span>}</h1>
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

const Page = () => {
	const {user} = useAuthStore()
	const [create, setCreate] = useState(false);
	const [data, setData] = useState<Classroom[]>([]);
	const [clickedCardId, setClickedCardId] = useState<string | null>(null)

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const classrooms = await getClassrooms(user.userOrgId)
			if (classrooms) setData(classrooms)
		}
		getData()
	}, [user])

	const handlCreate = () => {
		setCreate(!create);

	};

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
					<Link href="/admin/classrooms"
					      className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">Classrooms</Link>
					<Link href="/admin/teachers" className="">
						Teachers
					</Link>
					<Link href="/admin/students" className="">Students</Link>
				</nav>
				<button
					className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
				>
					{/* onClick function left to add on this button, present in /teachers */}
					+ Create
				</button>
			</div>
			{create && (
				<dialog className="absolute bg-black w-full h-full top-0 left-0 bg-opacity-40">
					<div className="modal-form bg-white w-4/12 max-md:w-fit p-6 mx-auto my-36 rounded-md shadow-lg">
						<div className="flex justify-between items-center">
							<h2 className="text-black font-semibold text-xl mb-3">
								Create New Teacher
							</h2>
							<button onClick={handlCreate}>X</button>
						</div>
						<form className="max-w-md mx-auto">
							<div className="mb-4">
								<label htmlFor="name" className="block mb-1">
									Name:
								</label>
								<input
									type="text"
									id="name"
									className="w-full border rounded-md py-2 px-3"
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="class" className="block mb-1">
									Class:
								</label>
								<input
									type="text"
									id="class"
									className="w-full border rounded-md py-2 px-3"
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="date" className="block mb-1">
									Date:
								</label>
								<input
									type="date"
									id="date"
									className="w-full border rounded-md py-2 px-3"
								/>
							</div>
							<button
								type="submit"
								className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600"
							>
								Create
							</button>
						</form>
					</div>
				</dialog>
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
                                        key={item.classroomId}
                                        item={item}
                                        activeId={clickedCardId}
                                        setActive={setClickedCardId}
                                    />
                                )
						}))}
				</div>
			</main>
		</>
	)
}

export default Page
