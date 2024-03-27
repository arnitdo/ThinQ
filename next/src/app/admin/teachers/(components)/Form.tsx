
import useAuthStore from "@/lib/zustand";
import { CreateBulkUserBody, CreateClassroomBody, CreateUserBody, OrgIdBaseParams } from "@/util/api/api_requests";
import { getTeachers, makeAPIRequest } from "@/util/client/helpers";
import { useForm } from "@/util/client/hooks/useForm";
import { AuthUser } from "@/util/middleware/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {CreateUserBodyClientValidator} from "@/util/validators/client";
import { ResponseJSON } from "@/util/api/api_meta";
import Dropzone from "react-dropzone";


export default function Form({ create, setCreate }: { create: boolean, setCreate: (value: boolean) => void }) {
    const [facultyId, setFacultyId] = useState<string>("")
    const handleCreate = () => {
        setCreate(!create);
    };
    const [data, setData] = useState<AuthUser[]>([{
        userDisplayName:"Test",
        userId:"1",
        userName:"test",
        userOrgId:"1",
        userType:"Teacher"
    },{
        userDisplayName:"Test1",
        userId:"2",
        userName:"test",
        userOrgId:"1",
        userType:"Teacher"
    },{
        userDisplayName:"Test2",
        userId:"3",
        userName:"test",
        userOrgId:"1",
        userType:"Teacher"
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
            const file = files[0];
            console.log(file)
            if (file) {
                if (file.type === 'text/csv') {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const textContent = e.target!.result;
                        if(textContent === null) return;
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

    const loginForm = useForm<CreateUserBody>({
        formInputs: {
          userName: {
            inputType: "text",
            initialValue: ""
          },
          userDisplayName: {
            inputType: "text",
            initialValue: ""
          },
          userPassword: {
            inputType: "text",
            initialValue: ""
          },
          userType: {
            inputType: "text",
            initialValue: "Teacher"
          }
        },
        nameBinding: {
          userDisplayName: "Display Name",
          userName: "Username",
          userPassword: "User Password",
          userType: "User Type"
        },
        formValidator: {
          ...CreateUserBodyClientValidator,
        },
        valueChangeListener: (attribute, newValue) => {
          console.log({attribute, newValue})
        }
      })

      const onCSV = async (csvData: string) => {
        if(!user) return;
        const response = await makeAPIRequest<ResponseJSON, OrgIdBaseParams, CreateBulkUserBody>({
          requestUrl: "/api/orgs/:orgId/teachers/csv",
          urlParams: {
            orgId: user.userOrgId
          },
          bodyParams: {
            csvData: csvData
          },
          queryParams: {},
          requestMethod: "POST"
        })
    
        const {hasResponse, responseData, hasError, errorData, statusCode} = response
        
        if (hasResponse){
          if(responseData.responseStatus === "SUCCESS"){
            toast.success("Teachers created in successfully!")
          }else{
            toast.error("Error creating Teachers: "+responseData.responseStatus)
          }
          setCreate(false)
        }else{
            toast.error("Error creating Teachers!")
        }
      
      }
    
      const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if(!user) return;
        const response = await makeAPIRequest<ResponseJSON, OrgIdBaseParams, CreateUserBody>({
          requestUrl: "/api/orgs/:orgId/users",
          urlParams: {
            orgId: user.userOrgId
          },
          bodyParams: {
            userDisplayName: loginForm.formValues.userDisplayName,
            userName: loginForm.formValues.userName,
            userPassword: loginForm.formValues.userPassword,
            userType: loginForm.formValues.userType
          },
          queryParams: {},
          requestMethod: "POST"
        })
    
        const {hasResponse, responseData, hasError, errorData, statusCode} = response
        
        if (hasResponse){
          if(responseData.responseStatus === "SUCCESS"){
            toast.success("Teacher created in successfully!")
          }
          setCreate(false)
        }else{
            toast.error("Error creating Teacher!")
        }
      
      }

    return (
        <div className="absolute bg-black inset-0 top-0 left-0 bg-opacity-40">
            <div className="modalContainer | absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 w-2/3 max-sm:w-11/12 mx-auto rounded-[1.25rem] max-sm:text-sm">
                <div className="flex items-center justify-between mb-7 px-1 text-black">
                    <h1 className="text-2xl max-sm:text-lg">Add New Teacher</h1>
                    <button onClick={handleCreate} className="text-2xl">X</button>
                </div>

                <div className="modalGrid | grid gap-3 sm:grid-cols-[1fr_auto_1fr] grid-cols-[auto] items-center">
                    <div className="w-full p-6 rounded-2xl border border-[#A5A5A5] text-center">
                        <h2 className="font-semibold text-xl text-black mb-6 text-start">Upload using CSV File</h2>
                        <a href="https://docs.google.com/spreadsheets/d/11wiOOCADxM1GuEl3W6jo8_g3LjxU9Q8iaE8HDXlyEZI/edit#gid=1777853821" target="_blank" className="flex gap-2 text-black py-1 px-4 border border-[#A3A3A3] mx-auto w-fit rounded-full mb-8 shadow-[0_9px_14px_hsl(0,0%,0%,25%)]">Visit Sample Link <img src="/modalSampleLinkIcon.svg" alt="" /></a>
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

                    <p className="font-bold text-gray-400 text-sm text-center">OR</p>

                    <div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
                        <div className="flex justify-between items-center mb-3 text-black">
                            <h2 className="font-semibold text-xl">
                                Manually type data
                            </h2>
                        </div>
                        <form onSubmit={onSubmit} className="max-w-md mx-auto">
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-1">
                                    Teacher Display Name:
                                </label>
                                <input
                                    id="name"
                                    className="w-full border rounded-md py-2 px-3"
                                    {...loginForm.formControls.userDisplayName}
                                    placeholder="E.g. Comps-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-1">
                                Teacher Username:
                                </label>
                                <input
                                    id="name"
                                    className="w-full border rounded-md py-2 px-3"
                                    {...loginForm.formControls.userName}
                                    placeholder="E.g. Comps-1"
                                />
                              </div>
                              <div className="mb-4">
                                <label htmlFor="name" className="block mb-1">
                                Teacher Password:
                                </label>
                                <input
                                    id="name"
                                    className="w-full border rounded-md py-2 px-3"
                                    {...loginForm.formControls.userPassword}
                                    placeholder="E.g. Comps-1"
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
    )
}
