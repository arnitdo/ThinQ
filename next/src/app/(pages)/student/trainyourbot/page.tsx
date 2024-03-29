import React from 'react'

const Page = () => {
    return (
        <div className='justify-between | h-[81vh] flex flex-col relative'>
            {/* remove justify-between after file input */}
            {/* remove hidden after file input */}
            <div className='hidden | flex flex-col justify-end flex-grow py-4 px-2'>
                <div className="chatUser | self-end ms-[0.5rem] flex gap-3 items-start text-black">
                    <p className='text-xl font-medium p-6 border border-[#999999] rounded-[0.5rem] max-w-[50ch]'>hello from user</p>
                    <div className='text-[1.4375rem] font-medium bg-[#D9D9D9] p-3 rounded-[50%] w-14 h-14 grid place-items-center'>PD</div>
                </div>
                <div className="chatBot | self-start me-[0.5rem] flex gap-3 items-start text-black">
                    <img src="/botPfp.svg" alt="" />
                    <p className='text-xl font-medium p-6 border border-[#999999] rounded-[0.5rem] max-w-[50ch]'>hello from chatbot</p>
                </div>
            </div>

            {/* hidden after file input */}
            <h1 className='blur-[2px] | translate-y-16 font-bold text-9xl max-md:text-6xl max-sm:text-5xl text-transparent text-center bg-gradient-to-r from-secondary from-[12%] to-primary to-65% bg-clip-text'>Chatbot</h1>
            
            {/* blur 0 after file input */}
            <form action="" className='blur-[4px] | flex relative'>
                <input type="text" name="chatbotInput" id="chatbotInput" placeholder='Enter Message....' className='border border-[#999999] rounded-[0.5rem] flex-grow p-4 placeholder:text-[#6C6C6C] placeholder:text-xl placeholder:font-medium focus:outline-primary'/>
                <button type='submit' className='absolute right-3 top-1/2 -translate-y-1/2 border border-[#A5A5A5] shadow-[0_4px_4px_hsl(0,0%,0%,25%)] rounded-[0.5rem] p-2'>
                    <img src="/chatbotInputSubmitIcon.svg" alt="" />
                </button>
            </form>
            <div className=' | absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(200px,40%)] aspect-[2/1] flex flex-col justify-center items-center bg-[hsl(0,0%,100%,8%)] backdrop-blur-[10px] rounded-[0.5625rem] shadow-[0_4px_30px_hsl(0,0%,0%,6%)]'>
                {/* enter input file in this */}
                {/* hidden after file input */}
                <input type="file" name="" id="" className='w-[calc(100%_-_2rem)]'/>
            </div>
        </div>
    )
}

export default Page