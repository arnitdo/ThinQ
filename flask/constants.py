from utils import *

# ENV VARIABLES
load_dotenv()
S3_BUCKET = os.getenv('S3_BUCKET')
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

s3 = boto3.client(
    's3',
    region_name='ap-south-1',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    config=boto3.session.Config(signature_version='s3v4')
)

ses_client = boto3.client(
    'ses',
    region_name='ap-south-1',
    aws_access_key_id=AWS_SECRET_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

tokenizer = AutoTokenizer.from_pretrained("vennify/t5-base-grammar-correction")

model = AutoModelForSeq2SeqLM.from_pretrained("vennify/t5-base-grammar-correction")

console = Console()

db = Prisma()
db.connect()

genai.configure(api_key=GOOGLE_API_KEY)