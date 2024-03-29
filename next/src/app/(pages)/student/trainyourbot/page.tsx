import React from 'react'

const Page = () => {
    return (
        <div className='p-4 border w-full rounded-md items-center justify-center'>
            <div className='w-6/12 bg-white bg-opacity-60 mx-auto p-4 h-48 border rounded-md backdrop-blur-sm absolute justify-center items-center mt-40 text-center'><div className='mt-10'>
                <div >
                    <input />
                    <div className=" flex flex-col gap-1 -mt-8 border-black w-full rounded-xl overflow-clip justify-center items-center">
                        <p className=" text-xl font-semibold text-zinc-700">Choose a File</p>
                        <p className=" text-xl font-medium text-zinc-500">or</p>
                        <p className=" text-xl font-semibold text-zinc-700">Drag to Upload</p>
                    </div>
                </div></div></div>
            <h1 className='font-bold text-9xl max-md:text-6xl max-sm:text-5xl h-[81vh] text-gray-200 text-center mt-20'>Chatbot</h1>
        </div>
    )
}

export default Page