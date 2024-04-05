# Virtual Classroom Enhancer

This project is a comprehensive solution for virtual classrooms, providing a wide range of features to enhance the online learning experience. It is developed by Team MaamCoders, consisting of Arnav (Team Leader and Web Lead), Varad (Web Lead), Mihir(AI/ML Lead), Rishabh (UI and Frontend Lead), Milind (CSS Lead), and Prinkal (Frontend Subordinate).

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
