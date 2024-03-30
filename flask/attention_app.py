from io import BytesIO
from flask import Flask, jsonify, request , send_file, make_response, Response
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cv2
import argparse
import mediapipe as mp
from cv.resources import get_face_area
from cv.eye_detect import EyeDetector as EyeDet
from cv.pose_estimation import HeadPoseEstimator as HeadPoseEst
from cv.attention_scorer import AttentionScorer as AttScorer
import time
import numpy as np

camera = cv2.VideoCapture(0)
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

detector = mp.solutions.face_mesh.FaceMesh(static_image_mode=False,
                                           min_detection_confidence=0.5,
                                           min_tracking_confidence=0.5,
                                           refine_landmarks=True)

args = argparse.Namespace(camera=0, show_fps=True, show_proc_time=True, show_eye_proc=False, show_axis=True, verbose=False, smooth_factor=0.5, ear_thresh=0.15, ear_time_thresh=2, gaze_thresh=0.015, gaze_time_thresh=2, pitch_thresh=20, yaw_thresh=20, roll_thresh=20, pose_time_thresh=2.5)


if args.verbose:
    print(f"Arguments and Parameters used:\n{args}\n")

if not cv2.useOptimized():
    try:
        cv2.setUseOptimized(True)
    except:
        print(
            "OpenCV optimization could not be set to True, the script may be slower than expected")

detector = mp.solutions.face_mesh.FaceMesh(static_image_mode=False,
                                            min_detection_confidence=0.5,
                                            min_tracking_confidence=0.5,
                                            refine_landmarks=True)

Eye_det = EyeDet(show_processing=args.show_eye_proc)

Head_pose = HeadPoseEst(show_axis=args.show_axis)

t0 = time.perf_counter()
Scorer = AttScorer(t_now=t0, ear_thresh=args.ear_thresh, 
                    gaze_time_thresh=args.gaze_time_thresh,
                    roll_thresh=args.roll_thresh, 
                    pitch_thresh=args.pitch_thresh,
                    yaw_thresh=args.yaw_thresh, 
                    ear_time_thresh=args.ear_time_thresh,
                    gaze_thresh=args.gaze_thresh, 
                    pose_time_thresh=args.pose_time_thresh,
                    verbose=args.verbose)


def process_frame(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    frame_size = frame.shape[1], frame.shape[0]
    gray = np.expand_dims(cv2.bilateralFilter(gray, 5, 10, 10), axis=2)
    gray = np.concatenate([gray, gray, gray], axis=2)

    lms = detector.process(gray).multi_face_landmarks

    if lms:
        landmarks = _get_landmarks(lms)
        t_now = time.perf_counter()
        fps = 30

        Eye_det.show_eye_keypoints(color_frame=frame, landmarks=landmarks, frame_size=frame_size)

        ear = Eye_det.get_EAR(frame=gray, landmarks=landmarks)

        gaze = Eye_det.get_Gaze_Score(frame=gray, landmarks=landmarks, frame_size=frame_size)

        frame_det, roll, pitch, yaw = Head_pose.get_pose(frame=frame, landmarks=landmarks, frame_size=frame_size)

        asleep, looking_away, distracted = Scorer.eval_scores(t_now=time.perf_counter(), ear_score=ear,
                                                              gaze_score=gaze, head_roll=roll, head_pitch=pitch,
                                                              head_yaw=yaw)
        tired, perclos_score = Scorer.get_PERCLOS(t_now, fps, ear)
        if frame_det is not None:
            frame = frame_det

        if ear is not None:
            cv2.putText(frame, "EAR:" + str(round(ear, 3)), (10, 50), cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 1,
                        cv2.LINE_AA)

        if gaze is not None:
            cv2.putText(frame, "Gaze Score:" + str(round(gaze, 3)), (10, 80), cv2.FONT_HERSHEY_PLAIN, 2,
                        (0, 0, 255), 1, cv2.LINE_AA)

        cv2.putText(frame, "PERCLOS:" + str(round(perclos_score, 3)), (10, 110),
                    cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 1, cv2.LINE_AA)

        if roll is not None:
            cv2.putText(frame, "roll:" + str(roll.round(1)[0]), (450, 40), cv2.FONT_HERSHEY_PLAIN, 1.5,
                        (255, 0, 255), 1, cv2.LINE_AA)
        if pitch is not None:
            cv2.putText(frame, "pitch:" + str(pitch.round(1)[0]), (450, 70), cv2.FONT_HERSHEY_PLAIN, 1.5,
                        (255, 0, 255), 1, cv2.LINE_AA)
        if yaw is not None:
            cv2.putText(frame, "yaw:" + str(yaw.round(1)[0]), (450, 100), cv2.FONT_HERSHEY_PLAIN, 1.5,
                        (255, 0, 255), 1, cv2.LINE_AA)
            
        if tired:
            cv2.putText(frame, "TIRED!", (10, 280),
                        cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
        if asleep:
            cv2.putText(frame, "ASLEEP!", (10, 300), cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
        if looking_away:
            cv2.putText(frame, "LOOKING AWAY!", (10, 320), cv2.FONT_HERSHEY_PLAIN, 1, (0, 0, 255), 1, cv2.LINE_AA)
        if distracted:
            text = "DISTRACTED!"
            org = (10, 340)
            font = cv2.FONT_HERSHEY_PLAIN
            font_scale = 2
            font_thickness = 1
            line_type = cv2.LINE_AA
            (text_width, text_height), baseline = cv2.getTextSize(text, font, font_scale, font_thickness)
            background_position = (org[0], org[1] - text_height)
            background_size = (text_width, text_height + baseline)
            cv2.rectangle(frame, background_position, (background_position[0] + background_size[0], background_position[1] + background_size[1]), (255, 255, 255), -1)
            text_position = (background_position[0] + (background_size[0] - text_width) // 2, org[1]+8)
            cv2.putText(frame, text, text_position, font, font_scale, (0, 0, 255), font_thickness, line_type)

    return frame

def _get_landmarks(lms):
    surface = 0
    for lms0 in lms:
        landmarks = [np.array([point.x, point.y, point.z]) for point in lms0.landmark]
        landmarks = np.array(landmarks)

        landmarks[landmarks[:, 0] < 0., 0] = 0.
        landmarks[landmarks[:, 0] > 1., 0] = 1.
        landmarks[landmarks[:, 1] < 0., 1] = 0.
        landmarks[landmarks[:, 1] > 1., 1] = 1.

        dx = landmarks[:, 0].max() - landmarks[:, 0].min()
        dy = landmarks[:, 1].max() - landmarks[:, 1].min()
        new_surface = dx * dy
        if new_surface > surface:
            biggest_face = landmarks

    return biggest_face

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

app = Flask(__name__) 
CORS(app)

@app.route('/attention_detect')
def attention_detect():
    def generate_frames():
        while True:
            success, frame = camera.read()

            if not success:
                break
            else:
                frame = process_frame(frame)
                ret, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/', methods=['GET']) 
def helloworld(): 
    if request.method == 'GET': 
        data = {"data": "PICT Hackathon Attention Detection App Backend"}
        return jsonify(data), 200
if __name__ == '__main__': 
	app.run(debug=True,port=8000)