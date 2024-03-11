from utils import *

# ENV VARIABLES
load_dotenv()
S3_BUCKET = os.getenv('S3_BUCKET')
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

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