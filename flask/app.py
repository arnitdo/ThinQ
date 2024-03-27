from calendar import c
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
                s3_key = f'orgs/{organization_id}/classrooms/{class_id}/resources/{filename}'

                save_dir = f's3/orgs/{organization_id}/classrooms/{class_id}/resources/'
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

        save_dir = f's3/orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/'
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        
        filename = f'transcript.txt'
        local_file_path = os.path.join(save_dir, filename)
        with open(local_file_path, 'w') as f:
            f.write(transcript_text)

        s3_key = f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/{filename}'
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
    
@app.route('/s3_download_resources', methods=['GET'])
def s3_download_resources():
    request_data = request.get_json()
    organization_id = request_data.get('organization_id')
    class_id = request_data.get('class_id')
    save_dir = 'compute/'
    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No PDF files found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/'):]:
                if key.lower().endswith('.pdf'):
                    filename = os.path.basename(key)
                    local_file_path = os.path.join(save_dir, filename)
                    s3.download_file(S3_BUCKET, key, local_file_path)

        return jsonify({'success': True, 'message': 'PDF files downloaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/s3_download_lectures', methods=['GET'])
def s3_download_lectures():
    request_data = request.get_json()
    organization_id = request_data.get('organization_id')
    class_id = request_data.get('class_id')
    lecture_id = request_data.get('lecture_id')
    save_dir = 'compute/'
    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No Transcript files found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/'):]:
                if key.lower().endswith('.txt'):
                    filename = os.path.basename(key)
                    local_file_path = os.path.join(save_dir, filename)
                    s3.download_file(S3_BUCKET, key, local_file_path)

        return jsonify({'success': True, 'message': 'Transcript files downloaded successfully'}), 200
    except Exception as e:
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

@app.route('/rag_embed_resources', methods=['POST'])
def rag_embed_resources():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        
        pdf_directory = 'compute/'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No PDF files found for the given organization_id and class_id'})
        if not os.path.exists(pdf_directory):
            os.makedirs(pdf_directory)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/'):]:
                if key.lower().endswith('.pdf'):
                    filename = os.path.basename(key)
                    local_file_path = os.path.join(pdf_directory, filename)
                    s3.download_file(S3_BUCKET, key, local_file_path)

        if not os.path.isdir(pdf_directory):
            return jsonify({'error': 'PDF directory not found'}), 400

        pdf_files = os.listdir(pdf_directory)
        if not pdf_files:
            return jsonify({'error': 'No PDF files found in the directory'}), 400
        
        all_pdf_text = []
        for pdf_file in pdf_files:
            pdf_path = os.path.join(pdf_directory, pdf_file)
            with open(pdf_path, 'rb') as pdf_file:
                pdf_bytes = pdf_file.read()
            
            pdf_text = get_pdf_text_from_bytes(pdf_bytes)
            all_pdf_text.append(pdf_text)

        combined_text = '\n'.join(all_pdf_text) 
        text_chunks = get_text_chunks(combined_text)

        get_vector_store(text_chunks, filepath=f'compute/')

        local_directory = f'compute/faiss_index/'
        for filename in os.listdir(local_directory):
            if os.path.isfile(os.path.join(local_directory, filename)):
                s3_key = f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/{filename}'
                with open(os.path.join(local_directory, filename), 'rb') as file:
                    s3.upload_fileobj(file, S3_BUCKET, s3_key)
        return jsonify({'success': True, 'message': 'Transcript files downloaded and processed successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree(pdf_directory)

@app.route('/rag_embed_lectures', methods=['POST'])
def rag_embed_lectures():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        
        text_directory = 'compute/'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No Transcript files found for the given organization_id and class_id'})
        if not os.path.exists(text_directory):
            os.makedirs(text_directory)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/'):]:
                if key.lower().endswith('.txt'):
                    filename = os.path.basename(key)
                    local_file_path = os.path.join(text_directory, filename)
                    s3.download_file(S3_BUCKET, key, local_file_path)

        if not os.path.isdir(text_directory):
            return jsonify({'error': 'Text directory not found'}), 400

        text_files = os.listdir(text_directory)
        if not text_files:
            return jsonify({'error': 'No text files found in the directory'}), 400
        
        all_text_content = []
        for text_file in text_files:
            text_path = os.path.join(text_directory, text_file)
            with open(text_path, 'r') as file:
                text_content = file.read()
                all_text_content.append(text_content)

        combined_text = '\n'.join(all_text_content) 
        text_chunks = get_text_chunks(combined_text)

        get_vector_store(text_chunks, filepath=f'compute/')

        local_directory = f'compute/faiss_index/'
        for filename in os.listdir(local_directory):
            if os.path.isfile(os.path.join(local_directory, filename)):
                s3_key = f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/{filename}'
                with open(os.path.join(local_directory, filename), 'rb') as file:
                    s3.upload_fileobj(file, S3_BUCKET, s3_key)
        return jsonify({'success': True, 'message': 'Transcript files downloaded and processed successfully'}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree(text_directory)

@app.route('/question_rag_resources', methods=['POST'])
def question_rag_resources():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        question = request_data.get('question')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        answer = user_input(question, filepath=f'compute/')
        return jsonify(answer), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/question_rag_lectures', methods=['POST'])
def question_rag_lectures():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        question = request_data.get('question')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        answer = user_input(question, filepath=f'compute/')
        return jsonify(answer), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/get_mcq_resources', methods=['POST'])
def get_mcq_resources():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        topic = request_data.get('topic')
        no_of_questions = request_data.get('no_of_questions')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
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
        answer = user_input(prompt, filepath=f'compute/')
        cleaned_json_string = answer['output_text'].replace('\\n', '').replace('\\', '').replace('`', '').replace('json', '')
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/get_mcq_lectures', methods=['POST'])
def get_mcq_lectures():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        no_of_questions = request_data.get('no_of_questions')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
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
        answer = user_input(prompt, filepath=f'compute/')
        cleaned_json_string = answer['output_text'].replace('\\n', '').replace('\\', '').replace('`', '').replace('json', '')
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/get_notes_resources', methods=['POST'])
def get_notes_resources():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        topic = request_data.get('topic')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        prompt = '''
        Generate comprehensive notes on the topic "{}" based on the provided resources.
        Consider the following aspects:
        - Summarize key points covered in the resources.
        - Include relevant insights and examples.
        - Ensure clarity and coherence in the generated notes.

        Topic: {}
        '''.format(topic, topic)
        answer = user_input(prompt, filepath=f'compute/')
        answer = answer["output_text"].replace("**","").replace("`","")
        console.log(answer, log_locals=True) 
        return jsonify({"output_text": answer}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/get_notes_lectures', methods=['POST'])
def get_notes_lectures():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        prompt = '''
        Generate comprehensive notes based on the provided resources.
        Consider the following aspects:
        - Summarize key points covered in the resources.
        - Include relevant insights and examples.
        - Ensure clarity and coherence in the generated notes.
        '''
        answer = user_input(prompt, filepath=f'compute/')
        answer = answer["output_text"].replace("**","").replace("`","")
        console.log(answer, log_locals=True) 
        return jsonify({"output_text": answer}), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/get_short_ans_questions_resources', methods=['POST'])
def get_short_ans_questions_resources():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        topic = request_data.get('topic')
        no_of_questions = request_data.get('no_of_questions')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        prompt = '''
        Please provide a JSON with {} questions of topic {} in the following schema:

        {{
        "questions": [
            {{
            "questionText": "Question text goes here",
            }},
            {{
            "questionText": "Question text goes here",
            }},
            // Add more questions as needed
        ]
        }}

        Ensure the provided JSON adheres to the defined schema.
        '''.format(no_of_questions,topic)
        answer = user_input(prompt, filepath=f'compute/')
        cleaned_json_string = answer['output_text'].replace('\\n', '').replace('\\', '').replace('`', '').replace('json', '')
        print(cleaned_json_string)
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/get_short_ans_questions_lectures', methods=['POST'])
def get_short_ans_questions_lectures():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        lecture_id = request_data.get('lecture_id')
        no_of_questions = request_data.get('no_of_questions')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/lectures/{lecture_id}/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        prompt = '''
        Please provide a JSON with {} generated questions in the following schema:

        {{
        "questions": [
            {{
            "questionText": "Question text goes here",
            }},
            {{
            "questionText": "Question text goes here",
            }},
            // Add more questions as needed
        ]
        }}

        Ensure the provided JSON adheres to the defined schema.
        '''.format(no_of_questions)
        answer = user_input(prompt, filepath=f'compute/')
        cleaned_json_string = answer['output_text'].replace('\\n', '').replace('\\', '').replace('`', '').replace('json', '')
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/validate_short_ans_questions', methods=['POST'])
def validate_short_ans_questions():
    try:
        request_data = request.get_json()
        organization_id = request_data.get('organization_id')
        class_id = request_data.get('class_id')
        question = request_data.get('question')
        answer = request_data.get('answer')
        save_dir = 'compute/faiss_index'
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/')
        objects = response.get('Contents')
        if not objects:
            return jsonify({'error': 'No RAG Embeddings found for the given organization_id and class_id'})
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        for obj in objects:
            key = obj['Key']
            if '/' not in key[len(f'orgs/{organization_id}/classrooms/{class_id}/resources/faiss_index/'):]:
                filename = os.path.basename(key)
                local_file_path = os.path.join(save_dir, filename)
                s3.download_file(S3_BUCKET, key, local_file_path)
        prompt = '''
        Calculate the semantic similarity and literal similarity of the provided answer '{}' to the question '{}' based on meaning and literal match respectively.

        Semantic similarity represents the degree to which the meaning of the provided answer matches the actual answer.

        Literal similarity represents the degree to which the provided answer matches the actual answer word-for-word.

        Please provide a JSON of semantic similarity and literal similarity scores in the following schema:

        {{
        "output": [
            {{
            "question": "Question text goes here",
            "answer": "Answer text goes here",
            "semanticSimilarity": "Semantic similarity score (0-100)",
            "literalSimilarity": "Literal similarity score (0-100)"
            }}
        ]
        }}
        
        Ensure that the provided scores are within the range of 0 to 100.
        Ensure the provided JSON adheres to the defined schema.
        '''.format(answer,question)
        result = user_input(prompt, filepath=f'compute/')
        cleaned_json_string = result['output_text'].replace('\\n', '').replace('\\', '').replace('`', '').replace('json', '')
        data = json.loads(cleaned_json_string)
        console.log(data, log_locals=True) 
        return jsonify(data), 200
    except Exception as e:
        console.log({'error': str(e)}, log_locals=True) 
        return jsonify({'error': str(e)}), 500
    finally:
        shutil.rmtree("compute")

@app.route('/transcript_correct_grammar', methods=['POST'])
def transcript_correct_grammar():
    request_data = request.get_json()
    transcript = request_data.get('transcript')
    corrected_text = correct_grammar(transcript)
    console.log({"transcript": corrected_text}, log_locals=True) 
    return jsonify({"transcript": corrected_text}),200

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