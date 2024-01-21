import { RequestHandler, Response } from "express"
import { formatZodError } from "@/utils"
import { routes as helloRouter } from "@/routers/hello"
import { routes as userRoutes } from "@/routers/user"
import { routes as tagRoutes } from "@/routers/tag"
import { routes as categoryRoutes } from "@/routers/category"

type ParamsDictionary = Record<string, string>

export type SuccessBody<TData = any> = {
  code: 200
  data: TData
}

export type ErrorBody = {
  code: 400 | 401 | 403 | 404 | 500 | 501 | 502 | 503 | 504
  message: string
  zerrors?: ReturnType<typeof formatZodError>["errors"]
  rawError?: any
}
export type Body<TData = any> = SuccessBody<TData> | ErrorBody

export type ServerResponseBody<TData = any> = Response<Body<TData>>

export type Route = {
  path: string
  method: "get" | "post"
  handler: RequestHandler<ParamsDictionary>
}
export type Routes = ReadonlyArray<Route>

/**
 * @description re-export all routes here
 */
export const routes: Routes = [
  ...helloRouter,
  ...userRoutes,
  ...tagRoutes,
  ...categoryRoutes,
  // ...otherRoutes,
] as const
