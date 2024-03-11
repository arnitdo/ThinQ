from io import BytesIO
from flask import Flask, jsonify, request , send_file, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os