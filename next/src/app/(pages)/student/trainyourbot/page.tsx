import React from 'react'

const Page = () => {
    return (
        <div className='h-[81vh] flex flex-col justify-between pt-16 relative'>
            <h1 className='blur-[4px] font-bold text-9xl max-md:text-6xl max-sm:text-5xl text-transparent text-center bg-gradient-to-r from-secondary from-[12%] to-primary to-65% bg-clip-text'>Chatbot</h1>
            <form action="" className='blur-[2px] flex relative'>
                <input type="text" name="chatbotInput" id="chatbotInput" placeholder='Enter Message....' className='border border-[#999999] rounded-[0.5rem] flex-grow p-4 placeholder:text-[#6C6C6C] placeholder:text-xl placeholder:font-medium focus:outline-primary'/>
                <button type='submit' className='absolute right-3 top-1/2 -translate-y-1/2 border border-[#A5A5A5] shadow-[0_4px_4px_hsl(0,0%,0%,25%)] rounded-[0.5rem] p-2'>
                    <img src="/chatbotInputSubmitIcon.svg" alt="" />
                </button>
            </form>
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-[2/1] flex flex-col justify-center items-center bg-[hsl(0,0%,100%,8%)] backdrop-blur-[10px] rounded-[0.5625rem] shadow-[0_4px_30px_hsl(0,0%,0%,6%)]'>
                    {/* enter input file in this */}
                    Choose a file 
                    <span>or</span>
                    Drag and Drop
                </div>
        </div>
    )
}

export default Page