"use client";

import '@livekit/components-styles';
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks,
} from '@livekit/components-react';
import {Track} from 'livekit-client';
import {useEffect, useState} from 'react';
import {GetMeetingTokenResponse} from "@/util/api/api_responses";
import {GetMeetingTokenParams} from "@/util/api/api_requests";
import {useAPIRequest} from "@/util/client/hooks/useApi";
import Draw from "@/components/Draw";
import useAuthStore from "@/lib/zustand";

type PageParams = {
	orgId: string,
	classroomId: string,
	lectureId: string
}

export default function Page({params}: {params: PageParams}) {
	const [accessToken, setAccessToken  ] = useState<string | null>(null);
	const [liveTranscript, setLiveTranscript] = useState<string>("")

	const {lectureId, orgId, classroomId} = params

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

	return (

		<LiveKitRoom
			video={true}
			audio={true}
			token={accessToken}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			style={{ minHeight: '100dvh' }}
		>
			<div className=' flex w-full px-6 py-8 rounded-lg h-fit'>
				<div className={` h-[70vh] rounded-xl w-full flex`}>
					<Draw room={lectureId} name={user?.userDisplayName || "Guest User"}/>
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
				<ControlBar />
				{/*<Dictaphone setDesc={setLiveTranscript} setLang={()=>{}}/>*/}
			</div>
		</LiveKitRoom>
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

	const definedTracks = tracks.filter((track) => {
		return track.publication !== undefined
	})

	console.log(definedTracks.map((trk) => {
		return trk.publication?.track?.mediaStream
	}))

	return (
		<GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	);
}
