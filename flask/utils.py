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
from ttsvoice import tts
import boto3
import botocore
from botocore.exceptions import ClientError
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
import scrapetube