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
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from PyPDF2 import PdfReader
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from xhtml2pdf import pisa
from io import BytesIO
import mimetypes
from werkzeug.utils import secure_filename
import re
import json
from bs4 import BeautifulSoup
import requests