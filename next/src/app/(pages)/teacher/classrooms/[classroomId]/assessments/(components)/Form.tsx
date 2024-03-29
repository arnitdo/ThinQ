import { set } from 'date-fns';
import React from 'react'
import { useState } from 'react';


const Form = ({ create, setCreate }: { create: boolean, setCreate: (value: boolean) => void}) => {
    
    const handleCreate = () => {
        setCreate(!create);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Submitted")

    }

  return (
    <div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
            <div className="bg-white p-10 w-4/12 max-[1106px]:w-7/12 mx-auto rounded-[1.25rem] max-sm:w-11/12 max-sm:mt-[8%] mt-[3%] max-sm:text-sm">
        <div className="modal-form max-md:w-full p-6 rounded-2xl border border-[#A5A5A5]">
          <div className="flex justify-between items-center mb-3 text-black">
            <h2 className="font-semibold text-xl">Manually type data</h2>
          </div>
          <form onSubmit={()=>{}} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">
              Assessment Name:
              </label>
              <input
                id="name"
                className="w-full border rounded-md py-2 px-3"
                // {...loginForm.formControls.classroomName}
                placeholder="Weekly OS Test"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="class" className="block mb-1">
                Maximum Marks
              </label>
              <input type="number" id="class" className="w-full border rounded-md py-2 px-3" placeholder="Maximum Marks" />
              {/* <input
                                    onClick={() => {selectRef.current?.click()}}
                                    type="text"
                                    id="class"
                                    className="w-full border rounded-md py-2 px-3"
                                    placeholder="E.g. Rakesh Patil"
                                    value={facultyId}

                                /> */}
              {/* <select value={facultyId} onChange={(e) => { setFacultyId(e.target.value) }} className=' w-full border rounded-md py-2 px-3'>
                            <option className=' hidden' value={""}>E.g. Rakesh Patil</option>
                            {data.map((teacher) => (<option key={teacher.userId} value={teacher.userId}>{teacher.userDisplayName}</option>
                            ))}
                        </select> */}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onSubmit={()=>{onSubmit}}
            >
              Create
            </button>
          </form>
        </div>
        <div className="text-center mt-4 underline cursor-pointer" onClick={() => setCreate(false)}>Close</div>
        </div>
        </div>
  )
}

export default Form
