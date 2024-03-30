import {withMiddlewares} from "@/util/middleware";
import {GetOrgUsersParams, OrgIdBaseParams, QuizIdBaseParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	BaseOrgIdParamServerValidator, BaseQuizIdParamServerValidator, matchUserOrgWithParamsOrg,
} from "@/util/validators/server";
import db from "@/util/db";
import {GetQuizAnalyticsResponse, GetUsersResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<QuizIdBaseParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Teacher","Student"], matchUserOrganization: matchUserOrgWithParamsOrg}),
	requireURLParams(["orgId","quizId"]),
	validateURLParams(BaseQuizIdParamServerValidator),
	async (req, res) => {
		const quizData = await db.quiz.findFirst({
			where:{
				quizId: req.params.quizId,
			},
			select:{
				quizId:true,
				quizName: true,
				lectureId: true,
				_count:{
					select:{
						quizAttempts:true
					}
				},
				quizQuestions:true,
				quizAttempts:{
					select:{
						attemptUser:{
							select:{
								userDisplayName:true,
								userId:true,
							}
						},
						attemptResponses:true,
						attemptTimestamp:true,
					}
				},
				quizLecture: {
					select:{
						_count:{
							select:{
								lectureAttendance:true
							}
						}
					}
				}
			}
		})
		if(!quizData) return res.status(404).json({responseStatus: "ERR_INTERNAL_ERROR"})
		res.status(200).json<GetQuizAnalyticsResponse>({
			responseStatus: "SUCCESS",
			quizAnalytics: quizData
		})
	}
)