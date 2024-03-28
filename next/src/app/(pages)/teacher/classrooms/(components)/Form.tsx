
import useAuthStore from "@/lib/zustand";
import { CreateBulkUserBody, CreateClassroomBody, OrgIdBaseParams } from "@/util/api/api_requests";
import { getTeachers, makeAPIRequest } from "@/util/client/helpers";
import { useForm } from "@/util/client/hooks/useForm";
import { AuthUser } from "@/util/middleware/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateClassroomBodyClientValidator } from "@/util/validators/client";
import { ResponseJSON } from "@/util/api/api_meta";
import Dropzone from 'react-dropzone'
import { PlusCircle } from "lucide-react";

export default function Form({ create, setCreate }: { create: boolean, setCreate: (value: boolean) => void }) {
    const [facultyId, setFacultyId] = useState<string>("")
    const handleCreate = () => {
        setCreate(!create);
    };
    const [data, setData] = useState<AuthUser[]>([{
        userDisplayName: "Test",
        userId: "1",
        userName: "test",
        userOrgId: "1",
        userType: "Teacher"
    }, {
        userDisplayName: "Test1",
        userId: "2",
        userName: "test",
        userOrgId: "1",
        userType: "Teacher"
    }, {
        userDisplayName: "Test2",
        userId: "3",
        userName: "test",
        userOrgId: "1",
        userType: "Teacher"
    }]);
    const { user } = useAuthStore()

    useEffect(() => {
        const getData = async () => {
            if (!user) return;
            const teachers = await getTeachers(user.userOrgId)
            if (teachers) setData(teachers)
        }
        getData()
    }, [user])

    const handleFileUpload = (files: File[]) => {
        try {
            const file = files![0];
            console.log(file)
            if (file) {
                if (file.type === 'text/csv') {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const textContent = e.target!.result;
                        if (textContent === null) return;
                        console.log(textContent.toString())
                        onCSV(textContent.toString());    
                    };
                    reader.readAsText(file);
                } else {
                    toast.error('Please upload a CSV file.');
                }
            }
        } catch (error) {
            toast.error("Error uploading file")
        }
    };

    const loginForm = useForm<CreateClassroomBody>({
        formInputs: {
            classroomName: {
                inputType: "text",
                initialValue: ""
            },
            facultyId: {
                inputType: "text",
                initialValue: ""
            }
        },
        nameBinding: {
            classroomName: "Classroom Name",
            facultyId: "Classroom Faculty"
        },
        formValidator: {
            ...CreateClassroomBodyClientValidator,
        },
        valueChangeListener: (attribute, newValue) => {
            console.log({ attribute, newValue })
        }
    })

    const onCSV = async (csvData: string) => {
        if (!user) return;
        const response = await makeAPIRequest<ResponseJSON, OrgIdBaseParams, CreateBulkUserBody>({
            requestUrl: "/api/orgs/:orgId/classroom/csv",
            urlParams: {
                orgId: user.userOrgId
            },
            bodyParams: {
                csvData: csvData
            },
            queryParams: {},
            requestMethod: "POST"
        })

        const { hasResponse, responseData, hasError, errorData, statusCode } = response

        if (hasResponse) {
            if (responseData.responseStatus === "SUCCESS") {
                toast.success("Classrooms created in successfully!")
            } else {
                toast.error("Error creating classroom: " + responseData.responseStatus)
            }
            setCreate(false)
        } else {
            toast.error("Error creating classroom!")
        }

    }

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (!user) return;
        const response = await makeAPIRequest<ResponseJSON, OrgIdBaseParams, CreateClassroomBody>({
            requestUrl: "/api/orgs/:orgId/classroom",
            urlParams: {
                orgId: user.userOrgId
            },
            bodyParams: {
                classroomName: loginForm.formValues.classroomName,
                facultyId: facultyId
            },
            queryParams: {},
            requestMethod: "POST"
        })

        const { hasResponse, responseData, hasError, errorData, statusCode } = response

        if (hasResponse) {
            if (responseData.responseStatus === "SUCCESS") {
                toast.success("Classroom created in successfully!")
            }
            setCreate(false)
        } else {
            toast.error("Error creating classroom!")
        }

    }

    return (
        <div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
            <div className="bg-white p-10 w-4/12 max-[1106px]:w-7/12 mx-auto rounded-[1.25rem] max-sm:w-11/12 max-sm:mt-[8%] mt-[3%] max-sm:text-sm">
                <div className="flex items-center justify-between mb-7 px-1 text-black">
                    <h1 className="text-2xl max-sm:text-lg">Create New Classroom</h1>
                    <button onClick={handleCreate} className="text-2xl"><PlusCircle style={{rotate:"45deg"}}/></button>
                </div>

                <div className="">
                    <div className="max-md:w-fit p-6 rounded-2xl border border-[#A5A5A5] mb-3 text-center">
                        <h2 className="font-semibold text-xl text-black mb-6 text-start">Upload using CSV File</h2>
                        <a href="https://docs.google.com/spreadsheets/d/11wiOOCADxM1GuEl3W6jo8_g3LjxU9Q8iaE8HDXlyEZI/edit#gid=1782265963" target="_blank" className="flex gap-2 text-black py-1 px-4 border border-[#A3A3A3] mx-auto w-fit rounded-full mb-8 shadow-[0_9px_14px_hsl(0,0%,0%,25%)]">Visit Sample Link <img src="/modalSampleLinkIcon.svg" alt="" /></a>
                        {/* <input onChange={(e) => { handleFileUpload(e) }} type="file" name="csvFileUpload" accept=".csv" id="csvFileUpload" className="p-6 border-2 border-[#909090] border-dashed rounded-[0.5625rem] w-full" /> */}
                        <Dropzone onDrop={acceptedFiles => handleFileUpload(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className=" flex flex-col gap-1 py-8 border border-black border-dashed w-full rounded-xl overflow-clip justify-center items-center">
                                        <p className=" text-xl font-semibold text-zinc-700">Choose a File</p>
                                        <p className=" text-xl font-medium text-zinc-500">or</p>
                                        <p className=" text-xl font-semibold text-zinc-700">Drag to Upload</p>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    </div>

                    <p className="mb-3 font-bold text-gray-400 text-sm text-center">OR</p>

                    <div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
                        <div className="flex justify-between items-center mb-3 text-black">
                            <h2 className="font-semibold text-xl">
                                Manually type data
                            </h2>
                        </div>
                        <form onSubmit={onSubmit} className="max-w-md mx-auto">
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-1">
                                    Class Name:
                                </label>
                                <input
                                    id="name"
                                    className="w-full border rounded-md py-2 px-3"
                                    {...loginForm.formControls.classroomName}
                                    placeholder="E.g. Comps-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="class" className="block mb-1">
                                    Class Faculty:
                                </label>
                                {/* <input
											onClick={() => {selectRef.current?.click()}}
											type="text"
											id="class"
											className="w-full border rounded-md py-2 px-3"
											placeholder="E.g. Rakesh Patil"
											value={facultyId}

										/> */}
                                <select value={facultyId} onChange={(e) => { setFacultyId(e.target.value) }} className=' w-full border rounded-md py-2 px-3'>
                                    <option className=' hidden' value={""}>E.g. Rakesh Patil</option>
                                    {data.map((teacher) => (<option key={teacher.userId} value={teacher.userId}>{teacher.userDisplayName}</option>))}
                                </select>
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
    )
}
