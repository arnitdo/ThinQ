import { useState } from "react"

// {date, setDate}: {date: Date, setDate: (date: Date) => void}
export default function Calender() {
    const [year, setYear] = useState<number>(((new Date()).getFullYear()))
    const [month, setMonth] = useState<number>(((new Date()).getMonth()))
    const [day, setDay] = useState<number>(((new Date()).getDate()))
    const [hour, setHour] = useState<number>(((new Date()).getHours()))
    const [seconds, setSeconds] = useState<number>(0)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    function handleSubmit() {
        const d = new Date(year, month, day, hour, seconds)
        console.log(d)
    }

    function handleCancel() {
        throw new Error("Function not implemented.")
    }

  return (
    <>
    
<div className="w-80 flex flex-col bg-white border shadow-lg rounded-xl overflow-hidden dark:bg-slate-900 dark:border-gray-700">
  <div className="p-3">
    <div className="space-y-0.5">
      <div className=" grid-cols-5 items-center gap-x-3 mx-1.5 pb-3 hidden">{/*grid*/}
        <div className="col-span-1">
          <button type="button" className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>
        <div className="col-span-3 flex justify-center items-center gap-x-1 ">
          <div className="relative">
            <select data-hs-select='{
                "placeholder": "Select month",
                "toggleTag": "<button type=\"button\"></button>",
                "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 before:absolute before:inset-0 before:z-[1] dark:text-gray-200 dark:hover:text-gray-300 dark:focus:text-gray-300",
                "dropdownClasses": "mt-2 z-50 w-32 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-slate-900 dark:border-gray-700",
                "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800",
                "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span><span className=\"hidden hs-selected:block\"><svg className=\"flex-shrink-0 size-3.5 text-gray-800 dark:text-gray-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
              }' >
              {months.map((monthName, ind)=><option selected={month===ind} onSelect={()=>setMonth(ind)} value={ind+1}>{monthName}</option>)}
            </select>
          </div>

          <span className="text-gray-800 dark:text-gray-200">/</span>

          <div className="relative">
            <select value={year} data-hs-select='{
                "placeholder": "Select year",
                "toggleTag": "<button type=\"button\"></button>",
                "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 before:absolute before:inset-0 before:z-[1] dark:text-gray-200 dark:hover:text-gray-300 dark:focus:text-gray-300",
                "dropdownClasses": "mt-2 z-50 w-20 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-slate-900 dark:border-gray-700",
                "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800",
                "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span><span className=\"hidden hs-selected:block\"><svg className=\"flex-shrink-0 size-3.5 text-gray-800 dark:text-gray-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
              }'>
              {[year, year+1].map((item, ind)=><option value={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="col-span-1 flex justify-end">
          <button type="button" className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg className="flex-shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
    
      </div>
      <div className="flex pb-1.5">
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          Mo
        </span>
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          Tu
        </span>
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          We
        </span>
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          Th
        </span>
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          Fr
        </span>
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          Sa
        </span>
        <span className="m-px w-10 block text-center text-sm text-gray-500">
          Su
        </span>
      </div>
    

    
      <div className="flex">
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===26?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(26)}>
            26
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===27?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(27)}>
            27
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===28?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(28)}>
            28
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===29?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(29)}>
            29
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===30?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(30)}>
            30
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===1?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(1)}>
            1
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===2?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(2)}>
            2
          </button>
        </div>
      </div>
    

    
      <div className="flex">
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===3?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(3)}>
            3
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===4?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(4)}>
            4
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===5?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(5)}>
            5
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===6?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(6)}>
            6
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===7?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(7)}>
            7
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===8?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(8)}>
            8
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===9?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(9)}>
            9
          </button>
        </div>
      </div>
    
      <div className="flex">
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===10?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(10)}>
            10
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===11?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(11)}>
            11
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===12?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(12)}>
            12
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===13?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(13)}>
            13
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===14?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(14)}>
            14
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===15?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(15)}>
            15
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===16?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(16)}>
            16
          </button>
        </div>
      </div>
    

      <div className="flex">
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===17?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(17)}>
            17
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===18?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(18)}>
            18
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===19?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(19)}>
            19
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===20?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(20)}>
            20
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===21?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(21)}>
            21
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===22?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(22)}>
            22
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===23?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(23)}>
            23
          </button>
        </div>
      </div>
    

    
      <div className="flex">
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===24?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(24)}>
            24
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===25?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(25)}>
            25
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===26?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(26)}>
            26
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===27?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(27)}>
            27
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===28?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(28)}>
            28
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===29?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(29)}>
            29
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===30?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(30)}>
            30
          </button>
        </div>
      </div>
    

    
      <div className="flex">
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===31?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(31)}>
            31
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===1?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(1)}>
            1
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===2?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(2)}>
            2
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===3?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(3)}>
            3
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===4?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(4)}>
            4
          </button>                                                                                                                                 
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===5?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(5)}>
            5
          </button>
        </div>
        <div>
          <button type="button" className={`m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 ${day===6?"border-blue-600 text-blue-600":""} hover:border-blue-600 hover:text-blue-600 rounded-full disabled:text-gray-300 disabled:pointer-events-none dark:text-gray-200 dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:disabled:text-gray-600 `} onClick={()=>setDay(6)}>
            6
          </button>
        </div>
      </div>
    
    </div>



    <div className="mt-3 flex justify-center items-center gap-x-2">
    
      <div className="relative">
        <select value={hour} onChange={(e)=>setHour(parseInt(e.target.value))} data-hs-select='{
            "placeholder": "Select option...",
            "toggleTag": "<button type=\"button\"></button>",
            "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600",
            "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-slate-900 dark:border-gray-700",
            "optionClasses": "hs-selected:bg-gray-100 py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:hs-selected:bg-gray-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800",
            "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span></div>"
          }' className="hidden">
          <option value=""></option>
          {[...Array(24)].map((v,ind)=><option value={ind}>{ind}</option>)}
        </select>

        <div className="absolute top-1/2 end-2 -translate-y-1/2">
          <svg className="flex-shrink-0 size-3 text-gray-500 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </div>
      </div>
    

      <span className="text-gray-800 dark:text-white">:</span>

    
      <div className="relative">
        <select value={seconds} onChange={(e)=>setSeconds(parseInt(e.target.value))} data-hs-select='{
            "placeholder": "Select option...",
            "toggleTag": "<button type=\"button\"></button>",
            "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600",
            "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-slate-900 dark:border-gray-700",
            "optionClasses": "hs-selected:bg-gray-100 py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:hs-selected:bg-gray-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800",
            "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span></div>"
          }' className="hidden">
          {[...Array(60)].map((v,ind)=><option value={ind}>{ind}</option>)}
        </select>

        <div className="absolute top-1/2 end-2 -translate-y-1/2">
          <svg className="flex-shrink-0 size-3 text-gray-500 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </div>
      </div>
    
    </div>

  </div>


  <div className="flex justify-end items-center gap-x-2 p-3 border-t dark:border-gray-700">
    <button onClick={()=>{handleCancel()}} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
      Cancel
    </button>
    <button onClick={()=>{handleSubmit()}} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
      Apply
    </button>
  </div>

</div>
    </>
  )
}
