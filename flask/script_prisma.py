from prisma import Prisma

db = Prisma()

db.connect()

# data = {
#   "questions": [
#     {
#       "questionText": "What is the role of the Control Unit (CU) in processor organization architecture?",
#       "questionOptions": [
#         "Fetching instructions from memory",
#         "Performing arithmetic and logical operations",
#         "Storing data temporarily during processing",
#         "Reducing the time it takes to access data from main memory"
#       ],
#       "questionAnswerIndex": 0
#     },
#     {
#       "questionText": "Which type of processor architecture uses separate buses for data and instructions?",
#       "questionOptions": [
#         "Von Neumann Architecture",
#         "Harvard Architecture",
#         "Pipelined Architecture",
#         "Superscalar Architecture"
#       ],
#       "questionAnswerIndex": 1
#     },
#     {
#       "questionText": "What is the purpose of cache memory in processor organization?",
#       "questionOptions": [
#         "Storing frequently accessed data and instructions",
#         "Coordinating the activities of the CPU",
#         "Performing arithmetic and logical operations",
#         "Increasing the throughput of the CPU"
#       ],
#       "questionAnswerIndex": 0
#     },
#     {
#       "questionText": "Which technique is used to increase the throughput of the CPU by overlapping the execution of multiple instructions?",
#       "questionOptions": [
#         "Superscalar Processing",
#         "Out-of-Order Execution",
#         "Pipelining",
#         "Cache Memory"
#       ],
#       "questionAnswerIndex": 2
#     },
#     {
#       "questionText": "What is the advantage of using superscalar processors?",
#       "questionOptions": [
#         "Improved performance by exploiting instruction-level parallelism",
#         "Reduced idle time",
#         "Increased throughput",
#         "Lower power consumption"
#       ],
#       "questionAnswerIndex": 0
#     }
#   ]
# }

def create_mcq_prisma(quiz_id,questionText,questionOptions,questionAnswerIndex):
    quizquestion = db.quizquestion.create({
        "quizId": quiz_id,
        "questionText": questionText,
        "questionOptions": questionOptions,
        "questionAnswerIndex": questionAnswerIndex,
    })
    return quizquestion


# for question in data["questions"]:
#     create_mcq_prisma(
#         "8d95e4d1-9604-423a-9ab7-8e289bb6af80",
#         question["questionText"],
#         question["questionOptions"],
#         question["questionAnswerIndex"]
#     )

# quiz = db.quiz.delete_many(where={"quizId": "1030bcba-7a01-4c3c-a45b-4fd9388b92c3"})
# quiz = db.quiz.create({
#     "quizName" : "POA Quiz",
#     "lectureId" : "be200d42-5da4-4f07-b618-7580d3de0a67",
# })

print("This is quiz")
quiz = db.quiz.find_many()
print(quiz)

# lectureId = "be200d42-5da4-4f07-b618-7580d3de0a67"
# quiz = db.quiz.find_first(where={"lectureId": lectureId})
# print(quiz)
# print(quiz.quizId)

print("\nThis is quizquestion")
quizquestion = db.quizquestion.find_many()
print(quizquestion)
