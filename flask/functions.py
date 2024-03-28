from constants import *

def get_pdf_text(pdf_file):
    text = ""
    pdf_reader = PdfReader(pdf_file)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def get_pdf_text_from_bytes(pdf_bytes):
    text = ""
    pdf_file = io.BytesIO(pdf_bytes)
    reader = PdfReader(pdf_file)
    num_pages = len(reader.pages)
    for page_num in range(num_pages):
        page = reader.pages[page_num]
        text += page.extract_text()
    return text

def get_text_chunks(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000, chunk_overlap=1000)
    chunks = splitter.split_text(text)
    return chunks  

def get_vector_store(chunks, filepath):
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001")  
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    filepath = filepath+"faiss_index"
    vector_store.save_local(filepath)

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-pro",
                                   client=genai,
                                   temperature=0.3,
                                   )
    prompt = PromptTemplate(template=prompt_template,
                            input_variables=["context", "question"])
    chain = load_qa_chain(llm=model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question,filepath):
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001")
    filepath = filepath+"faiss_index"
    new_db = FAISS.load_local(filepath, embeddings,allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain(
        {"input_documents": docs, "question": user_question}, return_only_outputs=True, )
    return response

def correct_grammar(text):
    input_text = "correction: " + text
    input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    output = model.generate(input_ids, max_length=512, num_beams=4, early_stopping=True)
    corrected_text = tokenizer.decode(output[0], skip_special_tokens=True)
    return corrected_text

def convert_html_to_pdf(html_string):
    pdf = BytesIO()
    pisa_status = pisa.CreatePDF(html_string, dest=pdf)
    if pisa_status.err:
        return None
    else:
        pdf.seek(0)
        return pdf

def save_json_to_s3(json_data, s3_path, filename):
    json_string = json.dumps(json_data)
    s3.put_object(
        Bucket=S3_BUCKET,
        Key=f"{s3_path}/{filename}",
        Body=json_string
    )

def download_json_from_s3(s3_path, filename):
    response = s3.get_object(
        Bucket=S3_BUCKET,
        Key=f"{s3_path}/{filename}"
    )
    json_data = json.loads(response['Body'].read())
    return json_data

def create_mcq_prisma(quizId,questionText,questionOptions,questionAnswerIndex):
    quizquestion = db.quizquestion.create({
        "quizId": quizId,
        "questionText": questionText,
        "questionOptions": questionOptions,
        "questionAnswerIndex": questionAnswerIndex,
    })
    return quizquestion

def create_notes_prisma(notesContent, lectureId):
    existing_notes = db.notes.find_many(where={"lectureId": lectureId})
    if existing_notes:
        for note in existing_notes:
            db.notes.delete_many(where={"lectureId": lectureId})
    existing_lecture = db.lecture.find_unique(where={"lectureId": lectureId})
    if existing_lecture:
        notesTitle = existing_lecture.title
        notes = db.notes.create({
            "notesContent": notesContent,
            "notesTitle": notesTitle,
            "lectureId": lectureId,
        })
        return notes
    else:
        print("Lecture not found.")
        return None