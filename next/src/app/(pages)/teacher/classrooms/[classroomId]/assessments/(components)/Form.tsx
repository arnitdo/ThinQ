import useAuthStore from "@/lib/zustand";
import { ResponseJSON } from "@/util/api/api_meta";
import { ClassroomParams, CreateAssessmentBody } from "@/util/api/api_requests";
import { makeAPIRequest } from "@/util/client/helpers";
import { useState } from "react";
import { toast } from "sonner";


const Form = ({ create, setCreate, classroomId }: { create: boolean, setCreate: (value: boolean) => void, classroomId: string }) => {
  const [title, setTile] = useState('')
  const [questions, setQuestions] = useState([{ question: "", marks: 0 }])
  const {user} = useAuthStore()
  const handleCreate = () => {
    setCreate(!create);
  };
  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submitted")
    if (!user) return;
        const response = await makeAPIRequest<ResponseJSON, ClassroomParams, CreateAssessmentBody>({
            requestUrl: "/api/orgs/:orgId/classroom/:classroomId/assessment",
            urlParams: {
                orgId: user.userOrgId,
                classroomId: classroomId
            },
            bodyParams: {
                assessmentTitle:title,
                assessmentQuestions: questions.map((question) => ({questionText: question.question, questionMarks: question.marks}))
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

  const addNew = () => {
    setQuestions(prev => {
      return [...prev, { question: "", marks: 0 }]
    })
  }

  return (
    <div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
      <div className="bg-white p-10 w-4/12 max-[1106px]:w-7/12 mx-auto rounded-[1.25rem] max-sm:w-11/12 max-sm:mt-[8%] mt-[3%] max-sm:text-sm">
        <div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
          <div className="flex justify-between items-center mb-3 text-black">
            <h2 className="font-semibold text-xl">Manually type data</h2>
          </div>
          <form onSubmit={onSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">
                Assessment Name:
              </label>
              <input
                id="name"
                value={title}
                onChange={(e) => { setTile(e.target.value) }}
                className="w-full border rounded-md py-2 px-3"
                // {...loginForm.formControls.classroomName}
                placeholder="Weekly OS Test"
              />
            </div>
            {questions.map((question, index) => {
              return (
                <div key={index} className=' mb-4 w-full grid grid-cols-3 gap-2'>
                  <div className=" col-span-2">
                    <label htmlFor="question" className="block mb-1">
                      Question {" " + (index + 1)}:
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => {
                        setQuestions(prev => {
                          let temp = [...prev]
                          temp[index].question = e.target.value
                          return temp
                        })
                      }}
                      className="w-full border rounded-md py-2 px-3"
                      placeholder="Weekly OS Test"
                    />
                  </div>
                  <div className=" col-span-1">
                    <label htmlFor="marks" className="block mb-1">
                      Marks:
                    </label>
                    <input
                      type="numeric"
                      value={question.marks}
                      min={0}
                      max={100}
                      onChange={(e) => {
                        setQuestions(prev => {
                          let temp = [...prev]
                          temp[index].marks = parseInt(e.target.value!==''?e.target.value.length>2?'100':e.target.value:'0')
                          return temp
                        })
                      }}
                      className="w-full border rounded-md py-2 px-3"
                      placeholder="100"
                    />
                  </div>
                </div>
              )
            })}

            <div className=' flex flex-row justify-between items-center'>
              <button
                type="button"
                className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => { addNew() }}
              >
                Add New
              </button>
              <button
                type="submit"
                className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600"
               
              >
                Create
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-4 underline cursor-pointer" onClick={() => setCreate(false)}>Close</div>
      </div>
    </div>
  )
}

export default Form
