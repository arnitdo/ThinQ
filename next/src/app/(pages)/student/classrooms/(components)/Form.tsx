
import useAuthStore from "@/lib/zustand";
import { ClassroomParams, CreateBulkUserBody, CreateClassroomBody, NoParams, OrgIdBaseParams } from "@/util/api/api_requests";
import { getTeachers, makeAPIRequest } from "@/util/client/helpers";
import { useForm } from "@/util/client/hooks/useForm";
import { AuthUser } from "@/util/middleware/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateEnrollmentBodyClientValidator } from "@/util/validators/client";
import { ResponseJSON } from "@/util/api/api_meta";

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

    const loginForm = useForm<ClassroomParams>({
        formInputs: {
            classroomId: {
                inputType: "text",
                initialValue: ""
            },
            orgId: {
                inputType: "text",
                initialValue: user?.userOrgId || ""
            }
        },
        nameBinding: {
            classroomId: "Classroom Code",
            orgId: "Classroom organization ID"
        },
        formValidator: {
            ...CreateEnrollmentBodyClientValidator,
        },
        valueChangeListener: (attribute, newValue) => {
            console.log({ attribute, newValue })
        }
    })

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (!user) return;
        const response = await makeAPIRequest<ResponseJSON, ClassroomParams, NoParams>({
            requestUrl: "/api/orgs/:orgId/classroom/:classroomId/enroll",
            urlParams: {
                orgId: user.userOrgId,
                classroomId: loginForm.formValues.classroomId
            },
            bodyParams:{}
            ,
            queryParams: {},
            requestMethod: "POST"
        })

        const { hasResponse, responseData, hasError, errorData, statusCode } = response

        if (hasResponse) {
            if (responseData.responseStatus === "SUCCESS") {
                toast.success("Enrolled successfully!")
            }
            setCreate(false)
        } else {
            toast.error("Error joining classroom!")
        }

    }

    return (
        <div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
            <div className="bg-white p-10 w-4/12 max-[1106px]:w-7/12 mx-auto rounded-[1.25rem] max-sm:w-11/12 max-sm:mt-[8%] mt-[3%] max-sm:text-sm">
                <div className="flex items-center justify-between mb-7 px-1 text-black">
                    <h1 className="text-2xl max-sm:text-lg">Join New Classroom</h1>
                    <button onClick={handleCreate} className="text-2xl">X</button>
                </div>

                <div className="">
                    <div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
                        <form onSubmit={onSubmit} className="max-w-md mx-auto">
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-1">
                                    Class Code:
                                </label>
                                <input
                                    id="name"
                                    className="w-full border rounded-md py-2 px-3"
                                    {...loginForm.formControls.classroomId}
                                    placeholder="E.g. Comps-1"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
