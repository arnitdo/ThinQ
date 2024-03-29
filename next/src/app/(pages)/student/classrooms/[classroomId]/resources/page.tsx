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
			title: "Notes"
        }
	
	]
	return (
		<>
			<NestedNav items={navlinks} button={(<></>)}/>

			<main className='py-4'>
				resources
			</main>
		</>
	)
}

export default Page

