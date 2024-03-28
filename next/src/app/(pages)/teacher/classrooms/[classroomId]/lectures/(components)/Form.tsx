import useAuthStore from "@/lib/zustand";
import {ClassroomParams, CreateLectureBody} from "@/util/api/api_requests";
import {getTeachers, makeAPIRequest} from "@/util/client/helpers";
import {useForm} from "@/util/client/hooks/useForm";
import {AuthUser} from "@/util/middleware/auth";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {CreateLectureBodyClientValidator} from "@/util/validators/client";
import {ResponseJSON} from "@/util/api/api_meta";
import {Calendar} from "@/components/ui/calendar"

export default function Form({ create, setCreate, classroomId }: { create: boolean, setCreate: (value: boolean) => void, classroomId: string }) {
    const [start, setStart] = useState<Date | undefined>(undefined)
    const [end, setEnd] = useState<Date | undefined>(undefined)
    const [calender, setCalender] = useState<"start" | "end" | undefined>(undefined)
    const [date, setDate] = useState<Date | undefined>(new Date())
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


    const loginForm = useForm<CreateLectureBody>({
        formInputs: {
            lectureStartTimestamp: {
                inputType: "text",
                initialValue: Date.now().toString()
            },
            lectureEndTimestamp: {
                inputType: "text",
                initialValue: (new Date(Date.now()+360000)).toString()
            },
            title:{
                inputType: "text",
                initialValue: ""
            }
        },
        nameBinding: {
            lectureEndTimestamp: "Lecture End Time",
            lectureStartTimestamp: "Lecture Start Time",
            title: "Lecture Title"
        },
        formValidator: {
            ...CreateLectureBodyClientValidator
        },
        valueChangeListener: (attribute, newValue) => {
            console.log({ attribute, newValue })
        }
    })
    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
    console.log({start, end})
        if(!(start&&end))return toast.error("Please select start and end time")
        if (!user) return;
        const response = await makeAPIRequest<ResponseJSON, ClassroomParams, CreateLectureBody>({
            requestUrl: "/api/orgs/:orgId/classroom/:classroomId/lecture",
            urlParams: {
                orgId: user.userOrgId,
                classroomId: classroomId
            },
            bodyParams: {
                lectureEndTimestamp: new Date(end),
                lectureStartTimestamp: new Date(start),
                title: loginForm.formValues.title
            },
            queryParams: {},
            requestMethod: "POST"
        })

        const { hasResponse, responseData, hasError, errorData, statusCode } = response

        if (hasResponse) {
            if (responseData.responseStatus === "SUCCESS") {
                toast.success("Lecture created in successfully!")
            }
            setCreate(false)
        } else {
            toast.error("Error creating Lecture!")
        }

    }

    function getStringDate(start: Date | string | number, end: Date | string | number) {
        let date = (new Date(start)).toLocaleDateString().toString();
        let startTime = (new Date(start)).toLocaleTimeString().toString();
        let endTime = (new Date(end)).toLocaleTimeString().toString();
        return date+", "+startTime+" to "+endTime;
    }

    return (
        <div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
            <div className="bg-white p-10 w-4/12 max-[1106px]:w-7/12 mx-auto rounded-[1.25rem] max-sm:w-11/12 max-sm:mt-[8%] mt-[3%] max-sm:text-sm">
                <div className="flex items-center justify-between mb-7 px-1 text-black">
                    <h1 className="text-2xl max-sm:text-lg">Create New Lecture</h1>
                    <button onClick={handleCreate} className="text-2xl">X</button>
                </div>

                <div className="">
                    
                    <div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
                        <form onSubmit={onSubmit} className="max-w-md mx-auto">
                            <div className="mb-4 relative">
                                <label htmlFor="name" className="block mb-1">
                                    Lecture Title:
                                </label>
                                <input
                                    id="name"
                                    className="w-full border rounded-md py-2 px-3"
                                    {...loginForm.formControls.title}
                                    placeholder="E.g. Comps-1"
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="name" className="block mb-1">
                                    Lecture Time:
                                </label>
                                <button
                                type="button"
                                onClick={()=>setCalender("start")}
                                    id="time"
                                    // disabled
                                    className="w-full text-left border rounded-md py-2 px-3"
                                    // placeholder="E.g. Comps-1"
                                >{start&&end?  getStringDate(start, end):"Select rooms start and end time"}</button>
                                {calender==="start"?<div className=" absolute top-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} setVisible={setCalender} onEndDate={setEnd} onDate={setStart} className="rounded-xl border bg-white"/>
                                </div>:<></>}
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
