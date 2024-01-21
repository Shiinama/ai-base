import type { Routes, ServerResponseBody } from "@/routers"
import { z } from "zod"
import {
  getUserInfo,
  login,
  resetPassword,
  updateUserPassword,
} from "@/services/user"
import { formatZodError, serviceOk } from "@/utils"

export const routes: Routes = [
  {
    method: "post",
    path: "/user/login",
    handler: async (req, res: ServerResponseBody) => {
      const _params = z
        .object({
          username: z.string().min(1, { message: "账号不可为空" }),
          password: z.string().min(1, { message: "密码不可为空" }),
        })
        .safeParse(req.body)
      if (_params.success === false) {
        res.json({
          code: 400,
          ...formatZodError(_params.error),
        })
        return
      }
      const { username, password } = _params.data
      const result = await login({ username, password })

      if (result.isLeft()) {
        const { token } = result.left().data as { token: string }
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        })
        res.json(serviceOk(null).unwrap())
        return
      }
      res.json(result.unwrap())
    },
  },
  {
    method: "post",
    path: "/user/logout",
    handler: async (req, res: ServerResponseBody) => {
      res.clearCookie("token")
      res.json({
        code: 200,
        data: null,
      })
    },
  },
  {
    method: "get",
    path: "/user/userInfo",
    handler: async (req, res: ServerResponseBody) => {
      const result = await getUserInfo(res.locals.user.id)
      res.json(result.unwrap())
    },
  },
  {
    method: "post",
    path: "/user/resetPassword",
    handler: async (req, res: ServerResponseBody) => {
      const _id = z
        .number({ invalid_type_error: "id 类型错误" })
        .safeParse(req.body.id)
      if (_id.success === false) {
        res.json({
          code: 400,
          ...formatZodError(_id.error),
        })
        return
      }

      const result = await resetPassword(_id.data)
      res.json(result.unwrap())
    },
  },
  {
    method: "post",
    path: "/user/updatePassword",
    handler: async (req, res: ServerResponseBody) => {
      const _params = z
        .object({
          oldPassword: z.string().trim().min(1, { message: "原密码不能为空" }),
          newPassword: z.string().trim().min(1, { message: "新密码不能为空" }),
        })
        .safeParse(req.body)
      if (_params.success === false) {
        res.json({
          code: 400,
          ...formatZodError(_params.error),
        })
        return
      }
      const { oldPassword, newPassword } = _params.data
      const result = await updateUserPassword(
        res.locals.user.id,
        oldPassword,
        newPassword,
      )
      res.json(result.unwrap())
    },
  },
]
