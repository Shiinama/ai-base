import type { Request, NextFunction } from "express"

import type { ServerResponseBody } from "@/routers"
import { JWTPayloadType, generateJWT, verifyJWT } from "@/services/token"
import { findUserById } from "@/services/user"
import { Errors } from "@/errors"

/**
 * Session middlewares 校验 token 是否有效
 * @param req
 * @param res
 * @param next
 * @returns
 * @category Middleware
 * @example
 * ```typescript
 * import { sessionMiddleware } from "@/middlewares/session";
 *
 * app.use(sessionMiddleware);
 * ```
 */
export async function sessionMiddleware(
  req: Request,
  res: ServerResponseBody,
  next: NextFunction,
) {
  res.locals.user = null

  const passRoutes = [
    "/api/user/login",
    "/api/user/logout",
    "/api/tag/list",
    "/api/category/list",
  ]

  if (req.path === "/" || passRoutes.includes(req.path)) {
    next()
    return
  }

  const token: string | undefined = req.cookies.token
  if (!token) {
    console.log(Errors.SESSION_UNAUTHORIZED.toString())
    res.json({
      code: 401,
      message: "未登录",
    })
    return
  }

  const result = verifyJWT(token)
  if (result.isRight()) {
    console.log(Errors.SESSION_INVALID_TOKEN.toString(), result.right())
    res.json({
      code: 401,
      message: "登录过期",
    })
    return
  }

  const { decoded } = result.left().data as { decoded: JWTPayloadType }
  const findUserByIdResult = await findUserById(decoded.id)
  if (findUserByIdResult.isRight()) {
    res.json({
      code: 401,
      message: "用户不存在",
    })
  }

  const user = findUserByIdResult.left()

  // 生成新的token。
  const newTokenResult = generateJWT({ user, expiresIn: "7d" })
  if (newTokenResult.isRight()) {
    console.log(Errors.SESSION_INVALID_TOKEN.toString(), newTokenResult.right())
    res.json({
      code: 401,
      message: "登录过期",
    })
    return
  }
  const newToken = newTokenResult.left().data as string
  res.cookie("token", newToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  })

  res.locals["user"] = user
  next()
}
