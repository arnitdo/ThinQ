"use client";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import useAuthStore from "@/lib/zustand";
import { getTeachers } from "@/util/client/helpers";
import { AuthUser } from "@/util/middleware/auth";
interface TeacherData {
  id: number;
  name: string;
  date_updated: string;
  classInc: string;
}

const Page = () => {
  const [data, setData] = useState<AuthUser[]>([]);
  const [create, setCreate] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {user} = useAuthStore()

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      const teachers = await getTeachers(user.userOrgId)
      if (teachers) setData(teachers)
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
  const handleCreate = () => {
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
          <Link href="/admin/teachers" className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">
            Teachers
          </Link>
          <Link href="/admin/students" className="">Students</Link>
        </nav>
        <button
          className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
          onClick={handleCreate}
        >
          + Create
        </button>
      </div>
      {create && (
				<div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
					<div className="bg-white p-10 w-4/12 max-[1106px]:w-7/12 mx-auto rounded-[1.25rem] max-sm:w-11/12 max-sm:mt-[8%] mt-[3%] max-sm:text-sm">
						<div className="flex items-center justify-between mb-7 px-1 text-black">
							<h1 className="text-2xl max-sm:text-lg">Create New Teacher</h1>
							<button onClick={handleCreate} className="text-2xl">X</button>
						</div>

						<div className="">
							<div className="max-md:w-fit p-6 rounded-2xl border border-[#A5A5A5] mb-3 text-center">
								<h2 className="font-semibold text-xl text-black mb-6 text-start">Upload using CSV File</h2>
								<Link href="#" className="flex gap-2 text-black py-1 px-4 border border-[#A3A3A3] mx-auto w-fit rounded-full mb-8 shadow-[0_9px_14px_hsl(0,0%,0%,25%)]">Visit Sample Link <img src="/modalSampleLinkIcon.svg" alt=""/></Link>
								<input type="file" name="csvFileUpload" id="csvFileUpload" className="p-6 border-2 border-[#909090] border-dashed rounded-[0.5625rem] w-full"/>
							</div>

							<p className="mb-3 font-bold text-gray-400 text-sm text-center">OR</p>

							<div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
								<div className="flex justify-between items-center mb-3 text-black">
									<h2 className="font-semibold text-xl">
										Manually type data
									</h2>
								</div>
								<form className="max-w-md mx-auto">
									<div className="mb-4">
										<label htmlFor="name" className="block mb-1">
											Teacher Name:
										</label>
										<input
											type="text"
											id="name"
											className="w-full border rounded-md py-2 px-3"
											placeholder="E.g. Comps-1"
										/>
									</div>
									<div className="mb-4">
										<label htmlFor="class" className="block mb-1">
											Class Faculty:
										</label>
										<input
											type="text"
											id="class"
											className="w-full border rounded-md py-2 px-3"
											placeholder="E.g. Rakesh Patil"
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
          <div className="bg-white w-fit max-md:w-fit p-6 mx-auto my-10 rounded-md shadow-lg border border-red-400">
            <div className="flex justify-between items-center">
              <h2 className="text-black font-semibold text-xl mb-3">
                Teacher Deleted
              </h2>

            </div>
          </div>
        </div>)
      }
      <main className="py-4 max-sm:text-xs overflow-auto text-[#525354] tables">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/2 text-start p-3 border-b">Teacher Name</th>
              <th className="text-start p-3 border-b">Username</th>
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
                    <img src="/deleteIcon.svg" alt="" className="cursor-pointer rounded-sm hover:bg-red-200 w-5" onClick={() => handleDelete(item.userId)} />
                    <img src="/renameIcon.svg" alt="" className="cursor-pointer rounded-sm hover:bg-gray-200 w-5" onClick={() => handleEdit(item.userId)} />
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

