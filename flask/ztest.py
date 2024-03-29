from prisma import Prisma

db = Prisma()

db.connect()

# print("Organizations")
# org = db.organization.find_many()
# for a in org:
#     print(a)

print("\nClassrooms")
classes = db.classroom.find_many()
for c in classes:
    print(c)

print("\nLectures")
lec = db.lecture.find_many()
for l in lec:
    print(l)
    print("\n")

# print("\nNotes")
# note = db.notes.find_many()
# for n in note:
#     print(n)

# print("\nQuiz")
# quiz = db.quiz.find_many()
# for q in quiz:
#     print(q)

# print("\nQuiz Question")
# quizquestion = db.quizquestion.find_many()
# for q in quizquestion:
#     print(q)

db.notes.delete_many()
db.quiz.delete_many()
db.quizquestion.delete_many()