from functions import *

app = Flask(__name__) 
CORS(app)

@app.route('/s3_upload', methods=['POST'])
def s3_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    files = request.files.getlist('file')
    organization_id = request.form['organization_id']
    class_id = request.form['class_id']
    try:
        for file in files:
            if file.filename == '':
                return jsonify({'error': 'No selected file'})     
            if file:
                filename = secure_filename(file.filename)
                content_type = 'application/pdf'
                file_content_type = mimetypes.guess_type(filename)[0]
                if file_content_type:
                    content_type = file_content_type
                s3_key = f'{organization_id}/{class_id}/{filename}'

                save_dir = f's3/{organization_id}/{class_id}/'
                if not os.path.exists(save_dir):
                    os.makedirs(save_dir)
                
                local_file_path = os.path.join(save_dir, filename)
                file.save(local_file_path)

                with open(local_file_path, 'rb') as f:
                    s3.upload_fileobj(f, S3_BUCKET, s3_key, ExtraArgs={'ContentType': content_type})
        return jsonify({'success': True, 'message': 'Files uploaded successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/s3_fetch_files', methods=['GET'])
def s3_fetch_files():
    try:
        organization_id = request.form['organization_id']
        class_id = request.form['class_id']
        if not organization_id or not class_id:
            return jsonify({'error': 'Organization ID and class ID are required.'}), 400
        prefix = f'{organization_id}/{class_id}/'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)
        file_info = []
        if 'Contents' in response:
            for obj in response['Contents']:
                file_name = obj['Key'].split('/')[-1]
                object_url = s3.generate_presigned_url('get_object', Params={'Bucket': S3_BUCKET, 'Key': obj['Key']})
                file_info.append({'file_name': file_name, 'object_url': object_url})

        return jsonify(file_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/s3_delete', methods=['DELETE'])
def s3_delete():
    try:
        organization_id = request.form['organization_id']
        class_id = request.form['class_id']
        filename = request.form['filename']
        s3_key = f'{organization_id}/{class_id}/{filename}'
        
        s3.delete_object(Bucket=S3_BUCKET, Key=s3_key)
        
        local_file_path = f's3/{organization_id}/{class_id}/{filename}'
        if os.path.exists(local_file_path):
            os.remove(local_file_path)
        
        return jsonify({'success': True, 'message': f'File {filename} deleted successfully'})
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            return jsonify({'error': f'File {filename} not found'})
        else:
            return jsonify({'error': str(e)})

@app.route('/s3_download', methods=['GET'])
def s3_download():
    try:
        organization_id = request.form['organization_id']
        class_id = request.form['class_id']
        filename = request.form['filename']
        prefix = f'{organization_id}/{class_id}/' + filename
        response = s3.get_object(Bucket=S3_BUCKET, Key=prefix)
        file_content = response['Body'].read()
        save_dir = f's3/{organization_id}/{class_id}/'
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
        organization_id = request.form['organization_id']
        class_id = request.form['class_id']
        pdf_files = request.files.getlist('pdf') 
        all_pdf_text = []
        
        for pdf in pdf_files:
            pdf_text = get_pdf_text(pdf)
            all_pdf_text.append(pdf_text)

        combined_text = '\n'.join(all_pdf_text) 
        text_chunks = get_text_chunks(combined_text)
        get_vector_store(text_chunks, filepath=f's3/{organization_id}/{class_id}/')

        local_directory = f's3/{organization_id}/{class_id}/faiss_index/'
        for filename in os.listdir(local_directory):
            if os.path.isfile(os.path.join(local_directory, filename)):
                s3_key = f'{organization_id}/{class_id}/faiss_index/{filename}'
                with open(os.path.join(local_directory, filename), 'rb') as file:
                    s3.upload_fileobj(file, S3_BUCKET, s3_key)
        return jsonify({'message': 'Text embedded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/question_rag', methods=['POST'])
def question_rag():
    try:
        organization_id = request.form['organization_id']
        class_id = request.form['class_id']
        question = request.form['question']
        answer = user_input(question, filepath=f's3/{organization_id}/{class_id}/')
        return jsonify(answer)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcript_correct_grammar', methods=['POST'])
def transcript_correct_grammar():
    transcript = request.form['transcript']
    corrected_text = correct_grammar(transcript)
    return jsonify({"transcript": corrected_text})

@app.route('/report_generation', methods=['POST'])
def report_generation():
    file_name = request.form['file_name']
    html = request.form['html']
    pdf = convert_html_to_pdf(html)
    if pdf:
        return Response(pdf, mimetype='application/pdf', headers={'Content-Disposition': 'attachment; filename={file_name}.pdf'})
    else:
        return "Error converting HTML to PDF"

@app.route('/', methods=['GET']) 
def helloworld(): 
	if(request.method == 'GET'): 
		data = {"data": "PICT Hackathon Backend"} 
		return jsonify(data) 

if __name__ == '__main__': 
	app.run(debug=True)