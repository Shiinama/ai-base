import type { Request, NextFunction } from "express"
import type { ServerResponseBody } from "@/routers"

/**
 * Log middlewares
 * @param req
 * @param res
 * @param next
 * @returns
 * @category Middleware
 * @example
 * ```typescript
 * import { logMiddleware } from "@/middlewares/log";
 *
 * app.use(logMiddleware);
 * ```
 */
export async function logMiddleware(
  req: Request,
  res: ServerResponseBody,
  next: NextFunction,
) {
  switch (req.method) {
    case "GET":
      console.log(
        `[${req.method}] ${req.path} #QUERY${JSON.stringify(
          req.query,
        )} #PARAMS${JSON.stringify(req.params)}`,
      )
      break
    case "POST":
      console.log(
        `[${req.method}] ${req.path} #BODY${JSON.stringify(
          req.body,
        )} #PARAMS${JSON.stringify(req.params)}`,
      )
      break
    default:
      console.log(`[${req.method}] ${req.path}`)
      break
  }
  next()
}
