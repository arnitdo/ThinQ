import {withMiddlewares} from "@/util/middleware";
import type {SampleGetResponse} from "@/util/api_responses";
import type {NoParams, SomeRequestQuery} from "@/util/api_requests";

export const GET = withMiddlewares<NoParams, NoParams, SomeRequestQuery>([

], async (req, res) => {
	console.log(req.query.someQueryKey)

	res.json<SampleGetResponse>({
		responseStatus: "SUCCESS",
		someKey: "someValue"
	})
})