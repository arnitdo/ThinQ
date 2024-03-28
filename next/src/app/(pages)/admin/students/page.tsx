"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import useAuthStore from "@/lib/zustand";
import { deleteUser, getStudents } from "@/util/client/helpers";
import { AuthUser } from "@/util/middleware/auth";
import Form from "./(components)/Form";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import NestedNav, { NavLink } from "@/components/NestedNav";

const Page = () => {
	const [data, setData] = useState<AuthUser[]>([]);
	const [create, setCreate] = useState(false);
	const [showToast, setShowToast] = useState(false);

	const { user } = useAuthStore()

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			console.log("fetching data")
			const students = await getStudents(user.userOrgId)
			if (students) setData(students)
		}
		if (!create)
			getData()
	}, [user, create])

	useEffect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				setShowToast(false);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [showToast]);

	const handleDelete = async (id: string) => {
		if (!user) return
		const updatedData = data.filter((item) => item.userId !== id);
		setData(updatedData);
		const response = await deleteUser(user.userOrgId, id)
		console.log(response)
		if (response) {
			toast.success("Teacher deleted successfully!")
		}
	};
	const handleClick = () => {
		setCreate(!create);
	};


	const handleEdit = (id: string) => {
		alert(id);
	};

	const navlinks: NavLink[] = [
		{
			href: `/admin/classrooms`,
			title: "Classrooms"
		},
		{
			href: `/admin/teachers`,
			title: "Teachers"
		},
		{
			href: `/admin/students`,
			title: "Students"
		}
	]

	return (
		<>

			<NestedNav items={navlinks} button={(<button
				className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
				onClick={handleClick}
			>+ Create</button>)} />

			{create && <Form create={create} setCreate={setCreate} />}
			
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
						{data.length === 0 ? (
							// relative to rightWrapper
							<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
								<Loader />
							</div>
						)
							:
							data.map((item) => (
								<tr key={item.userId}>
									<td className="p-3 border-b">{item.userDisplayName}</td>
									<td className="p-3 border-b">{item.userName}</td>
									<td className="p-3 border-b">
										<div className="flex gap-3">
											<img src="/deleteIcon.svg" alt=""
												className="cursor-pointer rounded-sm hover:bg-red-200 w-5"
												onClick={() => handleDelete(item.userId)} />
											<img src="/renameIcon.svg" alt=""
												className="cursor-pointer rounded-sm hover:bg-gray-200 w-5"
												onClick={() => handleEdit(item.userId)} />
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

