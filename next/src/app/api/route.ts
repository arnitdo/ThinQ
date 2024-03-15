import {withMiddlewares} from "@/util/middleware";
import type {SampleGetResponse} from "@/util/api_responses";
import type {NoParams, SomeRequestQuery} from "@/util/api_requests";

export const GET = withMiddlewares<NoParams, NoParams, SomeRequestQuery>(
	// requireAuthenticatedUser(),
	async (req, res) => {
		console.log(req.query.someQueryKey)

		console.log(req.cookies.get("some-key")?.value)

		res.setHeader("Set-Cookie", "some-key=some-value;path=/")

		res.json<SampleGetResponse>({
			responseStatus: "SUCCESS",
			someKey: "someValue"
		})
	}
)