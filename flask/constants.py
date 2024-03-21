from utils import *

# ENV VARIABLES
load_dotenv()
S3_BUCKET = os.getenv('S3_BUCKET')
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')



twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

s3 = boto3.client('s3',config=boto3.session.Config(signature_version='s3v4'))

ses_client = boto3.client('ses')

tokenizer = AutoTokenizer.from_pretrained("vennify/t5-base-grammar-correction")

model = AutoModelForSeq2SeqLM.from_pretrained("vennify/t5-base-grammar-correction")