from functions import *

app = Flask(__name__) 
CORS(app)

@app.route('/s3_upload_formdata', methods=['POST'])
def s3_upload_formdata():
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
        console.log({'message': 'Files uploaded successfully'}, log_locals=True)
        return jsonify({'success': True, 'message': 'Files uploaded successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}) , 500
    
@app.route('/s3_upload_pdf', methods=['POST'])
def s3_upload_pdf():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request data must be in JSON format'}), 400
        request_data = request.get_json()
        if 'files' not in request_data:
            return jsonify({'error': 'No files provided'}), 400
        files = request_data['files']
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        
        if not organization_id or not class_id:
            return jsonify({'error': 'Organization ID and Class ID must be provided'}), 400
        for file_data in files:
            filename = file_data.get('filename')
            file_content = file_data.get('content')
            if not filename or not file_content:
                return jsonify({'error': 'Invalid file data provided'}), 400

            save_dir = f's3/{organization_id}/{class_id}/'
            if not os.path.exists(save_dir):
                os.makedirs(save_dir)
                
            local_file_path = os.path.join(save_dir, filename)
            file_content_bytes = base64.b64decode(file_content)
            with open(local_file_path, 'wb') as f:  
                f.write(file_content_bytes)  

            s3_key = f'{organization_id}/{class_id}/{filename}'
            content_type = 'application/pdf'
            file_content_type = mimetypes.guess_type(filename)[0]
            if file_content_type:
                content_type = file_content_type
            
            with open(local_file_path, 'rb') as f:
                s3.upload_fileobj(f, S3_BUCKET, s3_key, ExtraArgs={'ContentType': content_type})
        console.log({'message': 'Files uploaded successfully'}, log_locals=True)
        return jsonify({'success': True, 'message': 'Files uploaded successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500

@app.route('/s3_upload_transcript', methods=['POST'])
def s3_upload_transcript():
    try:
        if not request.is_json:
            return jsonify({'error': 'Request data must be in JSON format'}), 400
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        transcript_text = request_data.get('transcript_text')
        
        if not organization_id or not class_id or not lecture_id or not transcript_text:
            return jsonify({'error': 'Missing required data fields'}), 400

        save_dir = f's3/{organization_id}/{class_id}/{lecture_id}/'
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        
        filename = f'{lecture_id}_transcript.txt'
        local_file_path = os.path.join(save_dir, filename)
        with open(local_file_path, 'w') as f:
            f.write(transcript_text)

        s3_key = f'{organization_id}/{class_id}/{lecture_id}/{filename}'
        content_type = 'text/plain' 
        file_content_type = mimetypes.guess_type(filename)[0]
        if file_content_type:
            content_type = file_content_type
        
        with open(local_file_path, 'rb') as f:
            s3.upload_fileobj(f, S3_BUCKET, s3_key, ExtraArgs={'ContentType': content_type})
        console.log({'message': 'Transcript uploaded successfully'}, log_locals=True)
        return jsonify({'success': True, 'message': 'Transcript uploaded successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500
    
@app.route('/s3_fetch_files', methods=['POST'])
def s3_fetch_files():
    try:
        data = request.get_json()
        organization_id = data.get('organization_id')
        class_id = data.get('class_id')
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
        console.log({'files': file_info}, log_locals=True)
        return jsonify(file_info), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500
    
@app.route('/s3_delete', methods=['DELETE'])
def s3_delete():
    try:
        data = request.get_json()
        organization_id = data.get('organization_id')
        class_id = data.get('class_id')
        filename = data.get('filename')
        if not organization_id or not class_id or not filename:
            return jsonify({'error': 'Organization ID, class ID, and filename are required.'}), 400
        s3_key = f'{organization_id}/{class_id}/{filename}'
        s3.delete_object(Bucket=S3_BUCKET, Key=s3_key)
        
        local_file_path = f's3/{organization_id}/{class_id}/{filename}'
        if os.path.exists(local_file_path):
            os.remove(local_file_path)
        console.log({'message': f'File {filename} deleted successfully'}, log_locals=True)
        return jsonify({'success': True, 'message': f'File {filename} deleted successfully'}), 200
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            console.log({'error': f'File {filename} not found'}, log_locals=True)
            return jsonify({'error': f'File {filename} not found'}), 400
        else:
            console.log({'error': str(e)}, log_locals=True)
            return jsonify({'error': str(e)}), 500

@app.route('/s3_download', methods=['GET'])
def s3_download():
    try:
        data = request.get_json()
        organization_id = data.get('organization_id')
        class_id = data.get('class_id')
        filename = data.get('filename')
        if not organization_id or not class_id or not filename:
            return jsonify({'error': 'Organization ID, class ID, and filename are required.'}), 400
        
        prefix = f'{organization_id}/{class_id}/' + filename
        response = s3.get_object(Bucket=S3_BUCKET, Key=prefix)
        file_content = response['Body'].read()
        save_dir = f's3/{organization_id}/{class_id}/'
        os.makedirs(save_dir, exist_ok=True) 
        with open(os.path.join(save_dir, filename), 'wb') as f:
            f.write(file_content)
        console.log({'message': f'File {filename} downloaded and saved successfully'}, log_locals=True)
        return jsonify({'success': True, 'message': f'File {filename} downloaded and saved successfully'}), 200
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "NoSuchKey":
            console.log({'error': f'File {filename} not found'}, log_locals=True)
            return jsonify({'error': f'File {filename} not found'}), 400 
        else:
            console.log({'error': str(e)}, log_locals=True)
            return jsonify({'error': str(e)}), 500 

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
        console.log({'message': 'Email sent successfully'}, log_locals=True)
        return jsonify({'message': 'Email sent successfully'}), 200
    except ClientError as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500

@app.route('/send_whatsapp_text', methods=['POST'])
def send_whatsapp_text():
    try:
        data = request.get_json()
        recipient_number = data.get('recipient_number')
        number = "whatsapp:" + recipient_number
        message_body = data.get('message_body')

        message = twilio_client.messages.create(
            from_=f'whatsapp:{TWILIO_PHONE_NUMBER}',
            body=message_body,
            to=number
        )
        console.log({'message': 'WhatsApp message sent successfully', 'message_sid': message.sid}, log_locals=True)
        return jsonify({'message': 'WhatsApp message sent successfully', 'message_sid': message.sid}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500

@app.route('/send_whatsapp_image', methods=['POST'])
def send_whatsapp_image():
    try:
        data = request.get_json()
        recipient_number = data.get('recipient_number')
        number = "whatsapp:" + recipient_number
        image_url = data.get('image_url')
        caption = data.get('caption')
        message = twilio_client.messages.create(
            from_=f'whatsapp:{TWILIO_PHONE_NUMBER}',
            body=caption,
            media_url=[image_url],
            to=number
        )
        console.log({'message': 'WhatsApp message with image sent successfully', 'message_sid': message.sid}, log_locals=True)
        return jsonify({'message': 'WhatsApp message with image sent successfully', 'message_sid': message.sid}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500

@app.route('/recommend_yt_videos', methods=['POST'])
def recommend_yt_videos():
    try:
        data = request.get_json()
        topic_name = data.get('topic_name')
        number_of_videos = data.get('number_of_videos')
        if not topic_name or not number_of_videos:
            return jsonify({'error': 'Topic name and number of videos are required.'}), 400

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
        console.log({'videos': ytvideos}, log_locals=True)
        return jsonify({'videos': ytvideos}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500

@app.route('/rag_embed_formdata', methods=['POST'])
def rag_embed_formdata():
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
        console.log({'message': 'Text embedded successfully'}, log_locals=True) 
        return jsonify({'message': 'Text embedded successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True)
        return jsonify({'error': str(e)}), 500
    
@app.route('/rag_embed_pdf', methods=['POST'])
def rag_embed_pdf():
    try:
        organization_id = request.json['organization_id']
        class_id = request.json['class_id']

        pdf_files_base64 = request.json.get('pdf')
        if not pdf_files_base64:
            return jsonify({'error': 'No PDF files provided'}), 400
        
        all_pdf_text = []
        for pdf_base64 in pdf_files_base64:
            pdf_bytes = base64.b64decode(pdf_base64)
            
            pdf_text = get_pdf_text_from_bytes(pdf_bytes)
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
        console.log({'message': 'Text embedded successfully'}, log_locals=True) 
        return jsonify({'message': 'Text embedded successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/rag_embed_transcript', methods=['POST'])
def rag_embed_transcript():
    try:
        organization_id = request.json['organization_id']
        class_id = request.json['class_id']
        lecture_id = request.json['lecture_id']
        
        local_directory = f's3/{organization_id}/{class_id}/{lecture_id}/'
        combined_text = ""
        for filename in os.listdir(local_directory):
            if filename.endswith('.txt'):
                with open(os.path.join(local_directory, filename), 'r') as file:
                    combined_text+=file.read()

        text_chunks = get_text_chunks(combined_text)

        get_vector_store(text_chunks, filepath=f's3/{organization_id}/{class_id}/{lecture_id}/')

        local_directory = f's3/{organization_id}/{class_id}/{lecture_id}/faiss_index/'
        for filename in os.listdir(local_directory):
            if os.path.isfile(os.path.join(local_directory, filename)):
                s3_key = f'{organization_id}/{class_id}/{lecture_id}/faiss_index/{filename}'
                with open(os.path.join(local_directory, filename), 'rb') as file:
                    s3.upload_fileobj(file, S3_BUCKET, s3_key)
        console.log({'message': 'Text embedded successfully'}, log_locals=True) 
        return jsonify({'message': 'Text embedded successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/question_rag_pdf', methods=['POST'])
def question_rag_pdf():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        question = request_data.get('question')
        answer = user_input(question, filepath=f's3/{organization_id}/{class_id}/')
        console.log(answer, log_locals=True) 
        return jsonify(answer), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/question_rag_transcript', methods=['POST'])
def question_rag_transcript():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request.json['lecture_id']
        question = request_data.get('question')
        answer = user_input(question, filepath=f's3/{organization_id}/{class_id}/{lecture_id}/')
        console.log(answer, log_locals=True) 
        return jsonify(answer), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/get_mcq_pdf', methods=['POST'])
def get_mcq_pdf():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        topic = request_data.get('topic')
        no_of_questions = request_data.get('no_of_questions')
        prompt = '''
        Please provide a JSON with {} questions and answers of topic {} in the following schema:

        {{
        "questions": [
            {{
            "questionText": "Question text goes here",
            "questionOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "questionAnswerIndex": 0,
            }},
            {{
            "questionText": "Question text goes here",
            "questionOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "questionAnswerIndex": 1,
            }},
            // Add more questions as needed
        ]
        }}

        Ensure the provided JSON adheres to the defined schema.
        '''.format(no_of_questions,topic)
        answer = user_input(prompt, filepath=f's3/{organization_id}/{class_id}/')
        cleaned_json_string = answer['output_text'].replace('\\n', '').replace('\\', '')
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/get_mcq_transcript', methods=['POST'])
def get_mcq_transcript():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        no_of_questions = request_data.get('no_of_questions')
        prompt = '''
        Please provide a JSON with {} generated questions and answers in the following schema:

        {{
        "questions": [
            {{
            "questionText": "Question text goes here",
            "questionOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "questionAnswerIndex": 0,
            }},
            {{
            "questionText": "Question text goes here",
            "questionOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "questionAnswerIndex": 1,
            }},
            // Add more questions as needed
        ]
        }}

        Ensure the provided JSON adheres to the defined schema.
        '''.format(no_of_questions)
        answer = user_input(prompt, filepath=f's3/{organization_id}/{class_id}/{lecture_id}/')
        cleaned_json_string = answer['output_text'].replace('\\n', '').replace('\\', '')
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/search_images')
def search_images():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter "query" is required.'}), 400
    try:
        url = f"https://www.google.com/search?q={query}&tbm=isch"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        images = []
        for img in soup.find_all('img'):
            images.append(img.get('src'))
        images = list(filter(lambda x: x is not None and x.startswith('http'), images))
        console.log({'images': images}, log_locals=True) 
        return jsonify({'images': images}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/transcript_correct_grammar', methods=['POST'])
def transcript_correct_grammar():
    request_data = request.get_json()
    transcript = request_data.get('transcript')
    corrected_text = correct_grammar(transcript)
    console.log({"transcript": corrected_text}, log_locals=True) 
    return jsonify({"transcript": corrected_text}),200

@app.route('/report_generation', methods=['POST'])
def report_generation():
    try:
        request_data = request.get_json()
        file_name = request_data.get('file_name')
        html = request_data.get('html')
        pdf = convert_html_to_pdf(html)
        if pdf:
            return Response(pdf, mimetype='application/pdf', headers={'Content-Disposition': 'attachment; filename={file_name}.pdf'}),200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET']) 
def helloworld(): 
    if request.method == 'GET': 
        data = {"data": "PICT Hackathon Backend"}
        console.log(data, log_locals=True) 
        return jsonify(data), 200

if __name__ == '__main__': 
	app.run(debug=True)