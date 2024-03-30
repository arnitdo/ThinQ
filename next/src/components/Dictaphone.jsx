"use client";

import React, {useEffect, useState} from "react";
import "babel-polyfill";
import SpeechRecognition, {useSpeechRecognition,} from "react-speech-recognition";

const Dictaphone = ({desc, setDesc, setLang}) => {
	const {
		transcript, listening, resetTranscript, browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	const [prevDesc, setPrevDesc] = useState(desc);
	
	const listenContinuously = async() => {
		console.log("listening")
		await SpeechRecognition.startListening({
			continuous: true, language: lang,
		});
	};
	useEffect(() => {
		listenContinuously()
	}, [])
	
	
	useEffect(() => {
		setDesc(transcript);
	}, [transcript]);
	
	const [use, setuse] = useState(true);
	const [lang, setlang] = useState("en");

	const fn = async() => {
		await SpeechRecognition.stopListening();
		await listenContinuously();
	}

	useEffect(() => {
		const interval = setInterval(() => {
		 if(SpeechRecognition){
			if(prevDesc===desc){
				fn()
			}else{
				setPrevDesc(desc)
			}
		 }

		}, 5000);
	
		return () => clearInterval(interval);
	  }, []);
	
	
	//   useEffect(() => {
	//     setLang(lang)
	//   },[lang])
	
	return (
		<div className=" hidden flex-row mt-6 gap-2 w-fit px-4 justify-center items-center">
			<p className=" text-xs flex font-medium">
				{listening ? (<img src="/unmute.png" alt=""/>) : (<img src="/mute.png" alt=""/>)}{" "}
			</p>
			<div className=" flex flex-row gap-4 ">
				<button
					className=" py-1 px-3 bg-slate-100/0  border-2 border-green-600 text-green-600 hover:text-slate-100 hover:bg-green-600 rounded-2xl transition-all"
					onClick={() => {
						listening ? SpeechRecognition.stopListening() : listenContinuously();
					}}
				>
					{listening ? "Mute" : "Unmute"}
				</button>
			</div>
		</div>);
};
export default Dictaphone;

{/* <button className=' py-1 px-3 bg-slate-100 border-2 border-slate-100 text-orange-600 hover:text-slate-100 hover:bg-orange-600 rounded-2xl transition-all' onClick={SpeechRecognition.stopListening}>Stop</button>
      <button className=' py-1 px-3 bg-slate-100 border-2 border-slate-100 text-orange-600 hover:text-slate-100 hover:bg-orange-600 rounded-2xl transition-all' onClick={resetTranscript}>Reset</button> */
}

{/* <button onClick={()=>{
            setlang("hi")
            setuse(true)
        }} className=' py-1 px-3 bg-slate-100 border-2 border-slate-100 text-orange-600 hover:text-slate-100 hover:bg-orange-600 rounded-2xl transition-all'>Hindi</button> */
}
{/* <button onClick={()=>{
            setlang("mwr")
            setuse(true)
        }} className=' py-1 px-3 bg-slate-100 border-2 border-slate-100 text-orange-600 hover:text-slate-100 hover:bg-orange-600 rounded-2xl transition-all'>Marwari</button> */
}