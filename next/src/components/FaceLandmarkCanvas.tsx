import React, {useEffect, useRef, useState} from "react";
import FaceLandmarkManager from "@/class/FaceLandmarkManager";

const FaceLandmarkCanvas = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
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
		const getUserCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.onloadedmetadata = () => {
						videoRef.current!.play();
						requestRef.current = requestAnimationFrame(animate);
					};
				}
			} catch (e) {
				console.log(e);
				alert("Failed to load webcam!");
			}
		};
		getUserCamera();

		return () => cancelAnimationFrame(requestRef.current);
	}, []);


	return (
		<div className={"flex flex-row justify-between items-center"}>
			<video
				ref={videoRef}
				loop={true}
				muted={true}
				autoPlay={true}
				playsInline={true}
			></video>
			<h3>{`${isDistracted}`}</h3>
		</div>
	);
};

export default FaceLandmarkCanvas;
