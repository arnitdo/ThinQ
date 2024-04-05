# Virtual Classroom Enhancer

This project is a comprehensive solution for virtual classrooms, providing a wide range of features to enhance the online learning experience. It is developed by Team MaamCoders, consisting of Arnav (Team Leader and Web Lead), Varad (Web Lead), Mihir(AI/ML Lead), Rishabh (UI and Frontend Lead), Milind (CSS Lead), and Prinkal (Frontend Subordinate).


https://github.com/MihirRajeshPanchal/ThinQ/assets/78205431/1a576f91-0fad-4d6c-b3ec-74c3ccf449b9


## Features

- **CRUD Features**: The application supports all CRUD operations for teams, including creation of admins, teachers, students, classrooms, assigning teachers to classrooms, creating lectures, and students joining lectures.

- **Calendar Integration**: A calendar that lists upcoming lectures for students and teachers.

- **Video Calling**: The application supports video calling with an integrated drawing board for an interactive experience. It also includes in-call chatting for interaction and live transcription.

- **Attention Tracking**: The application can detect the level of attention of students during lectures by tracking their eye movements.

- **Automated Note Generation**: The generated transcript from the video call is fed to a RAG trained LLM to generate notes. These notes are then displayed in handwritten form in the frontend which can be downloaded as PDFs.

- **Quiz Generation**: Quizzes are created from the transcript for student assessment using our LLM.

- **Analysis and Reporting**: Analysis of the quiz is conducted and represented in the form of graphs and charts to the teacher and can be mailed to the students' guardians.

- **Resource Upload and Storage**: Teachers can upload notes and resources to our own cloud storage. Our LLM will refer to these notes for training.

- **Train Your Own Bot Feature**: Students can upload their own PDF and then ask questions about it with our generated chatbot.

## Setup

### Next Frontend

```bash
cd next
npm i
npm run dev
```

### Flask Backend

```bash
cd flask
python -m venv venv
venv\Sceipts\activate
pip install -r requirements.txt
py app.py
```
## Contributors of the Project
<hr>
<p align="start">
<a  href="https://github.com/MihirRajeshPanchal/ThinQ/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MihirRajeshPanchal/ThinQ"/>
</a>
</p>

## Contributing
To contribute to this project, follow these steps:

1. Fork this repository.
2. Make your changes and commit them to your forked repository.
3. Create a pull request to merge your changes into the original repository.

<hr>

<div align="center">

### Show some ❤️ by starring this awesome Repository!

</div>

<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------ -->
<hr>
