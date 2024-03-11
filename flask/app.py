from utils import *
from constants import *
from functions import *

app = Flask(__name__) 
CORS(app)

@app.route('/s3_upload', methods=['POST'])
def s3_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    try:
        s3.upload_fileobj(file, S3_BUCKET, file.filename)
        return jsonify({'success': True, 'message': 'File uploaded successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/s3_delete/<filename>', methods=['DELETE'])
def s3_delete(filename):
    try:
        s3.delete_object(Bucket=S3_BUCKET, Key=filename)
        return jsonify({'success': True, 'message': f'File {filename} deleted successfully'})
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            return jsonify({'error': f'File {filename} not found'})
        else:
            return jsonify({'error': str(e)})

@app.route('/s3_download/<filename>', methods=['GET'])
def s3_download(filename):
    try:
        response = s3.get_object(Bucket=S3_BUCKET, Key=filename)
        file_content = response['Body'].read()
        save_dir = 'downloaded_images'
        os.makedirs(save_dir, exist_ok=True) 
        with open(os.path.join(save_dir, filename), 'wb') as f:
            f.write(file_content)
        return jsonify({'success': True, 'message': f'File {filename} downloaded and saved successfully {response}'})
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            return jsonify({'error': f'File {filename} not found'})
        else:
            return jsonify({'error': str(e)})

@app.route('/send_email', methods=['POST'])
def send_email():
    try:
        recipient_email = request.form['recipient_email']
        sender_email = 'mihirpanchal5400@gmail.com'
        subject = request.form['subject']
        html_body = request.form['html_body']

        ses_client.send_email(
            Destination={
                'ToAddresses': [
                    recipient_email,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': html_body,
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject,
                },
            },
            Source=sender_email,
        )
        return jsonify({'message': 'Email sent successfully'}), 200
    except ClientError as e:
        return jsonify({'error': str(e)}), 500

@app.route('/send_whatsapp_text', methods=['POST'])
def send_whatsapp_text():
    try:
        recipient_number = request.form['recipient_number']
        number = "whatsapp:"+recipient_number
        message_body = request.form['message_body']

        message = twilio_client.messages.create(
        from_=f'whatsapp:{TWILIO_PHONE_NUMBER}',
        body=message_body,
        to=number
        )
        
        return jsonify({'message': 'WhatsApp message sent successfully', 'message_sid': message.sid}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/send_whatsapp_image', methods=['POST'])
def send_whatsapp_image():
    try:
        recipient_number = request.form['recipient_number']
        number = "whatsapp:"+recipient_number
        image_url = request.form['image_url']
        caption = request.form['caption']
        message = twilio_client.messages.create(
            from_=f'whatsapp:{TWILIO_PHONE_NUMBER}',
            body=caption,
            media_url=[image_url],
            to=number
        )
        return jsonify({'message': 'WhatsApp message with image sent successfully', 'message_sid': message.sid}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@app.route('/recommend_yt_videos', methods=['POST'])
def recommend_yt_videos():
    topic_name = request.form['topic_name']
    number_of_videos = request.form['number_of_videos']
    videos = scrapetube.get_search(topic_name)
    
    ytvideos = []
    for video in videos:
        if len(ytvideos) >= int(number_of_videos):
            break
        video_details = {
            'videoId': video['videoId'],
            'thumbnail': video['thumbnail']['thumbnails'][0]["url"],  
            'title': video['title']['runs'][0]['text'],          
            'link': f"https://www.youtube.com/watch?v={video['videoId']}"
        }
        ytvideos.append(video_details)
    
    return jsonify({'videos': ytvideos})

@app.route('/rag_embed', methods=['POST'])
def rag_embed():
    try:
        pdf = request.files['pdf']
        subject_name = request.form['subject_name']
        pdf_text = get_pdf_text(pdf)
        text_chunks = get_text_chunks(pdf_text)
        get_vector_store(text_chunks,subject_name)
        return jsonify({'message': 'Text embedded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/question_rag', methods=['POST'])
def question_rag():
    try:
        question = request.form['question']
        subject_name = request.form['subject_name']
        answer = user_input(question, subject_name)
        return jsonify(answer)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET']) 
def helloworld(): 
	if(request.method == 'GET'): 
		data = {"data": "PICT Hackathon Backend"} 
		return jsonify(data) 

if __name__ == '__main__': 
	app.run(debug=True)