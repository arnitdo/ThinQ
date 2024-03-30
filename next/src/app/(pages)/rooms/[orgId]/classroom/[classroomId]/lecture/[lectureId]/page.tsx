"use client";

import '@livekit/components-styles';
import {
	Chat,
	ControlBar,
	GridLayout,
	LayoutContextProvider,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks,
} from '@livekit/components-react';
import {Track} from 'livekit-client';
import {useEffect, useRef, useState} from 'react';
import {GetMeetingTokenResponse} from "@/util/api/api_responses";
import {GetMeetingTokenParams} from "@/util/api/api_requests";
import {useAPIRequest} from "@/util/client/hooks/useApi";
import Draw from "@/components/Draw";
import useAuthStore from "@/lib/zustand";
import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import Dictaphone from '@/components/Dictaphone';
import {createTranscript} from '@/util/client/helpers';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {roleRoute} from '@/components/AuthChecker';

type LKVideoElement = HTMLVideoElement & {
	dataset: DOMStringMap
}

type PageParams = {
	orgId: string,
	classroomId: string,
	lectureId: string
}

export default function Page({params}: {params: PageParams}) {
	const [accessToken, setAccessToken  ] = useState<string | null>(null);
	const [liveTranscript, setLiveTranscript] = useState<string>("")

	const {lectureId, orgId, classroomId} = params
	const flaskUrl = process.env.NEXT_PUBLIC_FLASK_API_URL

	const {user} = useAuthStore()

	const {isLoading, hasResponse, responseData, hasError, errorData, statusCode} = useAPIRequest<GetMeetingTokenResponse, GetMeetingTokenParams>({
		requestMethod: "GET",
		requestUrl: "/api/orgs/:orgId/classroom/:classroomId/lecture/:lectureId/token",
		urlParams: {
			lectureId, orgId, classroomId
		},
		queryParams: {},
		bodyParams: {}
	})

	const router = useRouter()

	useEffect(() => {
		if (!isLoading){
			if (hasResponse){
				if (responseData.responseStatus === "SUCCESS"){
					const {accessToken} = responseData
					setAccessToken(accessToken)
				}
			}
		}
	}, [isLoading]);
	if (isLoading || accessToken === null){
		return <div>Loading the ThinQ Web Platform</div>

	}
	const handleTranscript=async()=>{
		if(!user) return
		if(user.userType==="Student") return
		const response = await createTranscript(params.orgId, params.classroomId, params.lectureId, liveTranscript)
		if(!response)return
		toast("Transcript saved successfully")
		console.log(flaskUrl)
		const blankRequest2 = fetch(`${flaskUrl}/generate_mcq_notes_transcript`,{
					method:"POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						organization_id: orgId,
						class_id: classroomId,
						lecture_id: lectureId
					})
				})

	}

	return (
		<div>
		<LiveKitRoom
			video={true}
			audio={true}
			token={accessToken}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			onDisconnected={async() => {
				handleTranscript()
				if(!user)return
				router.push(`${roleRoute[user.userType]}/classrooms`)
			}}

			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			style={{ minHeight: '100dvh' }}
		>
			<div className=' flex w-full px-6 py-8 rounded-lg h-fit'>
				<div className={` h-[70vh] rounded-xl w-full flex flex-row gap-4`}>
					<Draw room={lectureId} name={user?.userDisplayName || "Guest User"} />
					<div className=' w-[30vw] rounded-xl overflow-clip h-full bg-red-500'>
						<LayoutContextProvider>
						<Chat style={{height:"100%", width:"100%"}}/>
						</LayoutContextProvider>
					</div>
				</div>
			</div>
			{/* Your custom component with basic video conferencing functionality. */}
			<MyVideoConference />
			{liveTranscript.length > 0 && (
				<h1 className=' absolute bottom-[10vh] left-10 bg-slate-950 p-4 text-slate-100 bg-opacity-50 rounded-lg font-semibold'>{liveTranscript}</h1>
			)}
			{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
			<RoomAudioRenderer/>
			{/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
			<div className=' flex flex-row gap-2 justify-center w-full items-center'>
				<ControlBar controls={{camera: false}} />
				{user?.userType==="Teacher"&&<Dictaphone desc={liveTranscript} setDesc={setLiveTranscript} setLang={()=>{}}/>}
			</div>
		</LiveKitRoom>
		</div>
	);
}

function MyVideoConference() {
	// `useTracks` returns all camera and screen share tracks. If a user
	// joins without a published camera track, a placeholder track is returned.
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false },
	);

	const videoRef = useRef<HTMLVideoElement | null>(null)

	const lastVideoTimeRef = useRef(-1);
	const requestRef = useRef<number>(0);
	const [isDistracted, setIsDistracted] = useState(false);

	const animate = () => {
		if (
			videoRef.current &&
			videoRef.current.currentTime !== lastVideoTimeRef.current
		) {
			lastVideoTimeRef.current = videoRef.current.currentTime;
			try {
				const faceLandmarkManager = FaceLandmarkManager.getInstance();
				const landmarks = faceLandmarkManager.detectLandmarks(
					videoRef.current,
					Date.now()
				);
				if (
					landmarks &&
					landmarks.faceBlendshapes &&
					landmarks.faceBlendshapes.length > 0
				) {
					const eyeLookUpLeft =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookUpLeft"
						)?.score ?? 0;
					const eyeLookUpRight =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookUpRight"
						)?.score ?? 0;
					const eyeLookDownLeft =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookDownLeft"
						)?.score ?? 0;
					const eyeLookDownRight =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookDownRight"
						)?.score ?? 0;
					const eyeLookInLeft =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookInLeft"
						)?.score ?? 0;
					const eyeLookInRight =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookInRight"
						)?.score ?? 0;
					const eyeLookOutLeft =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookOutLeft"
						)?.score ?? 0;
					const eyeLookOutRight =
						landmarks.faceBlendshapes[0].categories.find(
							(shape) => shape.categoryName === "eyeLookOutRight"
						)?.score ?? 0;
					const weights = {
						upLeft: 1,
						upRight: 1,
						downLeft: 1,
						downRight: 1,
						inLeft: 0.5,
						inRight: 0.5,
						outLeft: 0.5,
						outRight: 0.5,
					};
					const gazeScore =
						weights.upLeft * eyeLookUpLeft +
						weights.upRight * eyeLookUpRight +
						weights.downLeft * eyeLookDownLeft +
						weights.downRight * eyeLookDownRight +
						weights.inLeft * eyeLookInLeft +
						weights.inRight * eyeLookInRight +
						weights.outLeft * eyeLookOutLeft +
						weights.outRight * eyeLookOutRight;
					const EAR =
						(eyeLookUpLeft +
							eyeLookUpRight +
							eyeLookDownLeft +
							eyeLookDownRight) /
						(2 * (eyeLookInLeft + eyeLookInRight + eyeLookOutLeft + eyeLookOutRight));

					const gazeThreshold = 1.4;
					const EARThreshold = 0.4;

					if (EAR < EARThreshold || gazeScore > gazeThreshold) {
						setIsDistracted(true);
					} else {
						setIsDistracted(false);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		console.log(isDistracted)
	}, [isDistracted]);

	useEffect(() => {
		if (videoRef.current) {
			requestRef.current = requestAnimationFrame(animate);
		}

		return () => cancelAnimationFrame(requestRef.current);
	}, [videoRef.current]);

	useEffect(() => {
		const videoElements = Array.from(document.querySelectorAll("video")) as LKVideoElement[]
		const localElements = videoElements.filter((elem) => {
			return !!(elem.dataset["lkLocalParticipant"])
		})

		if (localElements.length && !videoRef.current){
			const firstElement = localElements[0]
			videoRef.current = firstElement
		}
	}, [tracks]);

	return (
		<GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	);
}