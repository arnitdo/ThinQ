"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import useAuthStore from "@/lib/zustand";
import {getStudents} from "@/util/client/helpers";
import {AuthUser} from "@/util/middleware/auth";

const Page = () => {
	const [data, setData] = useState<AuthUser[]>([]);
	const [create, setCreate] = useState(false);
	const [showToast, setShowToast] = useState(false);

	const {user} = useAuthStore()

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const students = await getStudents(user.userOrgId)
			if (students) setData(students)
		}
		getData()
	}, [user])

	useEffect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				setShowToast(false);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [showToast]);

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this item?")) {
			const updatedData = data.filter((item) => item.userId !== id);
			setData(updatedData);
			setShowToast(true);
		}
	};
	const handleClick = () => {
		setCreate(!create);
	};


	const handleEdit = (id: string) => {
		alert(id);
	};

	return (
		<>

			<div className="flex justify-between items-end border-b pb-2">
				<nav className="font-medium p-2 flex gap-[1.875rem] max-sm:gap-3 max-sm:text-sm">
					<Link href="/admin/classrooms" className="">Classrooms</Link>
					<Link href="/admin/teachers" className="">
						Teachers
					</Link>
					<Link href="/admin/students"
					      className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">Students</Link>
				</nav>
				<button
					className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
					onClick={handleClick}
				>
					+ Create
				</button>
			</div>
			{create && (
				<div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
					<div className="bg-white p-10 w-4/12 mx-auto rounded-[1.25rem] mt-[3%]">
						<div className="flex items-center justify-between mb-7 px-1 text-black">
							<h1 className="text-2xl">Create New Student</h1>
							<button onClick={handleClick} className="text-2xl">X</button>
						</div>

						<div className="">
							<div className="max-md:w-fit p-6 rounded-2xl border border-[#A5A5A5] mb-11 text-center">
								<h2 className="font-semibold text-xl text-black mb-6 text-start">Upload using CSV File</h2>
								<Link href="#" className="flex gap-2 text-black py-1 px-4 border border-[#A3A3A3] mx-auto w-fit rounded-full mb-8 shadow-[0_9px_14px_hsl(0,0%,0%,25%)]">Visit Sample Link <img src="/modalSampleLinkIcon.svg" alt=""/></Link>
								<input type="file" name="csvFileUpload" id="csvFileUpload" className="p-6 border-2 border-[#909090] border-dashed rounded-[0.5625rem] w-full"/>
							</div>

							<p className="mb-11 font-bold text-black text-xl text-center">OR</p>

							<div className="modal-form max-md:w-fit p-6 rounded-2xl border border-[#A5A5A5]">
								<div className="flex justify-between items-center mb-3 text-black">
									<h2 className="font-semibold text-xl">
										Manually type data
									</h2>
								</div>
								<form className="max-w-md mx-auto">
									<div className="mb-4">
										<label htmlFor="name" className="block mb-1">
											Student Name:
										</label>
										<input
											type="text"
											id="name"
											className="w-full border rounded-md py-2 px-3 placeholder:pl-3"
											placeholder="E.g. Rishabh Pandey"
										/>
									</div>
									<div className="mb-4">
										<label htmlFor="class" className="block mb-1">
											Student Class:
										</label>
										<input
											type="text"
											id="class"
											className="w-full border rounded-md py-2 px-3"
											placeholder="E.g. IT-2"
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
						</div>
					</div>
				</div>
			)}
			{
				showToast && (<div className="absolute w-full h-full bg-opacity-40 top-0 left-0">
					<div
						className="bg-white w-fit max-md:w-fit p-6 mx-auto my-10 rounded-md shadow-lg border border-red-400">
						<div className="flex justify-between items-center">
							<h2 className="text-black font-semibold text-xl mb-3">
								Student Deleted
							</h2>

						</div>
					</div>
				</div>)
			}
			<main className="py-4 max-sm:text-xs overflow-auto text-[#525354] tables">
				<table className="w-full">
					<thead>
					<tr>
						<th className="text-start w-1/2 p-3 border-b">Student Name</th>
						<th className="text-start p-3 border-b items-center flex">
							Username
							{/*<img src="/sidebarCalendar.png" alt="" className="inline-block ml-2 w-4"/>*/}
						</th>
						<th className="border-b"></th>
					</tr>
					</thead>
					<tbody>
					{data.map((item) => (
						<tr key={item.userId}>
							<td className="p-3 border-b">{item.userDisplayName}</td>
							<td className="p-3 border-b">{item.userName}</td>
							<td className="p-3 border-b">
								<div className="flex gap-3">
									<img src="/deleteIcon.svg" alt=""
									     className="cursor-pointer rounded-sm hover:bg-red-200 w-5"
									     onClick={() => handleDelete(item.userId)}/>
									<img src="/renameIcon.svg" alt=""
									     className="cursor-pointer rounded-sm hover:bg-gray-200 w-5"
									     onClick={() => handleEdit(item.userId)}/>
								</div>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</main>
		</>
	);
};


export default Page;

