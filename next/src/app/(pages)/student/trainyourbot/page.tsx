"use client"
import Loader from '@/components/Loader';
import SmallLoader from '@/components/SmallLoader';
import useAuthStore from '@/lib/zustand';
import { manageMedia } from '@/util/s3/client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone'
import { toast } from 'sonner';
import { v4 } from 'uuid';

type ChatMessage = {
    message: string,
    user: "user" | "bot"
}
const Page = () => {
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [fileUpload, setFileUpload] = useState<boolean>(false)
    const [uuid, setUuid] = useState<string>("4af3f89c-0d21-47f5-9448-02c3eedeb101")
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ message: "How can I help you ?", user: "bot" }])
    const [msg, setMsg] = useState<string>("")
    const flaskUrl = process.env.NEXT_PUBLIC_FLASK_API_URL;
    const chatRef = useRef<HTMLDivElement>(null)
    function scrollToBottom(element:HTMLDivElement ) {
        element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
      }

    const handleFileUpload = async (files: File[]) => {
        try {
            const file = files![0];
            if (file) {
                if (file.type === 'application/pdf') {
                    setLoading(true)
                    const uniqueId = v4()
                    const mediaStatus = await manageMedia({
                        mediaFiles: [file],
                        requestMethod: "PUT",
                        objectKeyGenerator: (file) => {
                            return `chatbot/${uniqueId}/${file.name}`
                        }
                    })
                    if (mediaStatus[0].mediaSuccess === true) {
                        const response = await fetch(`${flaskUrl}/rag_embed_trainyourchatbot`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                unique_id: uniqueId,
                            })
                        });
                        if (response.ok) {
                            setUuid(uniqueId)
                            setFileUpload(true)
                            toast.success('File uploaded successfully');
                            setLoading(false)
                        } else {
                            toast.error('Error uploading file');
                        }
                    } else {
                        toast.error('Error uploading file');
                    }
                } else {
                    toast.error('Please upload a PDF file.');
                }
            }
        } catch (error) {
            toast.error("Error uploading file")
        }
    };
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return
        setLoading(true)
        setChatMessages([...chatMessages, { message: msg, user: "user" }, { message: "loading", user: "bot" }])
        const response = await fetch(`${flaskUrl}/question_rag_trainyourchatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: msg,
                unique_id: uuid
            })
        });
        setMsg("")
        if (!response.ok) {
            toast.error("Error sending message!")
            setLoading(false)
        }
        const data = await response.json();
        setChatMessages((prevMessages) => {
            const temp: ChatMessage[] = [...prevMessages, { message: data.output_text as string, user: "bot" as "bot" | "user" }].filter((chatMessage) => !(chatMessage.message === "loading" && chatMessage.user === "bot"))
            return temp
        })
        setLoading(false)
    }

    useEffect(() => {
      if(chatRef.current){
        scrollToBottom(chatRef.current)
      }
    }, [chatMessages])
    

    return (
        <div className={`${fileUpload ? "" : "justify-between"} | h-[85vh]  justify-end flex flex-col relative isolate`}>
            {/* remove justify-between after file input */}
            {/* remove hidden after file input */}
            <div ref={chatRef} className={`${fileUpload ? "" : "hidden"} | h-[75vh] overflow-y-scroll justify-end  py-4 px-2`}>
                {chatMessages.map((chatMessage, idx) => {
                    return chatMessage.user === "bot" ? (
                        <div key={`chatmsg-${idx}`} className="chatBot | w-max me-[0.5rem] flex gap-3 items-start text-black my-1">
                            <img src="/botPfp.svg" alt="" />
                            <p className='text-xl font-medium p-6 border border-[#999999] rounded-[0.5rem] max-w-[50ch]'>{chatMessage.message === "loading" ? <SmallLoader></SmallLoader> : chatMessage.message}</p>
                        </div>
                    ) : (
                        <div key={`chatmsg-${idx}`} className="chatUser | w-max ml-auto me-[0.5rem] flex gap-3 items-start text-black my-1">
                            <p className='text-xl font-medium p-6 border border-[#999999] rounded-[0.5rem] max-w-[50ch]'>{chatMessage.message}</p>
                            <div className='text-[1.4375rem] font-medium bg-[#D9D9D9] p-3 rounded-[50%] w-14 h-14 grid place-items-center'>{user?.userDisplayName.slice(0, 2).toUpperCase()}</div>
                        </div>
                    )
                })}


            </div>

            {/* hidden after file input */}
            {/* {(!fileUpload) &&  */}
            {(!fileUpload) ? (
                <h1 className='blur-[2px] | translate-y-16 font-bold text-9xl max-md:text-6xl max-sm:text-5xl text-transparent text-center bg-gradient-to-r from-secondary from-[12%] to-primary to-65% bg-clip-text  w-fit mx-auto z-10 | after:content-[""] after:absolute after:inset-[0_0_-2.4rem_0] after:z-0 after:bg-gradient-to-b after:from-transparent after:from-[100%] after:via-black after:via-[105%)] after:to-transparent'>Chatbot</h1>
            )
            :
            (
                <h1 className='blur-[0px] | chatbotTextAnimation | absolute top-0 left-1/2 -translate-x-1/2 translate-y-16 font-bold text-9xl max-md:text-6xl max-sm:text-5xl text-transparent text-center bg-gradient-to-r from-secondary from-[12%] to-primary to-65% bg-clip-text z-10 | after:content-[""] after:absolute after:inset-[0_0_-2.4rem_0] after:z-0 after:bg-gradient-to-b after:from-transparent after:from-[100%] after:via-black after:via-[105%)] after:to-transparent'>Chatbot</h1>
            )}
            {/* blur 0 after file input */}
            <div className={`${fileUpload ? "hidden" : ""} | absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(200px,40%)] aspect-[2/1] flex flex-col justify-center items-center bg-[hsl(0,0%,100%,8%)] backdrop-blur-[10px] rounded-[0.5625rem] shadow-[0_4px_30px_hsl(0,0%,0%,6%)]`}>
                {loading ?
                    <Loader />
                    :
                    // <input type="file" accept='application/pdf' onChange={(e)=>handleFileUpload(e.target.files ? Array.from(e.target.files) : [])} />
                    <Dropzone onDrop={acceptedFiles => handleFileUpload(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className=' p-4'>
                                <input {...getInputProps()} />
                                <div className=" flex flex-col gap-1 py-6 md:py-12 px-6 md:px-24 border border-black border-dashed w-full rounded-xl overflow-clip justify-center items-center">
                                    <p className=" text-xl font-semibold text-zinc-700">Choose a File</p>
                                    <p className=" text-xl font-medium text-zinc-500">or</p>
                                    <p className=" text-xl font-semibold text-zinc-700">Drag to Upload</p>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                }
            </div>
            {loading ?
                <></>
                :
                <form onSubmit={(e) => handleSubmit(e)} className={`${fileUpload ? "blur-[0px]" : "blur-[4px]"} | flex relative pb-6`}>
                    <input value={msg} onChange={(e) => setMsg(e.target.value)} type="text" name="chatbotInput" id="chatbotInput" placeholder='Enter Message....' className='border border-[#999999] rounded-[0.5rem] flex-grow p-4 placeholder:text-[#6C6C6C] placeholder:text-xl placeholder:font-medium focus:outline-primary' />
                    <button type='submit' className='absolute right-3 top-3 border border-[#A5A5A5] shadow-[0_4px_4px_hsl(0,0%,0%,25%)] rounded-[0.5rem] p-2'>
                        <img src="/chatbotInputSubmitIcon.svg" alt="" />
                    </button>
                </form>
            }
        </div>
    )
}

export default Page