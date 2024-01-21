import { z } from "zod"
import jwt from "jsonwebtoken"
import { capture, serviceErr, serviceOk } from "@/utils"

export type JWTPayloadType = {
  id: number
  name: string
  username: string
}

import type { User } from "@/services/user"

/**
 * 生成 JWT
 * @param user User
 * @returns token
 */
export function generateJWT({
  user,
  expiresIn,
}: {
  user: User
  expiresIn?: string | number
}) {
  // 读取私钥
  const _privateKey = z.string().safeParse(process.env.JWT_SECRET)
  const privateKey = _privateKey.success
    ? _privateKey.data
    : "blog_server_secret"
  // 生成 token
  let _token = capture(() =>
    jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
      } satisfies JWTPayloadType,
      privateKey,
      {
        expiresIn: expiresIn || "365y",
      },
    ),
  )
  if (_token.isRight()) {
    return serviceErr(500, "生成 token 失败")
  }
  const token = _token.left()

  return serviceOk(token)
}

export function verifyJWT(token: string) {
  const _privateKey = z.string().safeParse(process.env.JWT_SECRET)
  const privateKey = _privateKey.success ? _privateKey.data : "lg_ac_secret"

  const verifyRes = capture(() => {
    var decoded = jwt.verify(token, privateKey) as JWTPayloadType
    return { decoded }
  })
  if (verifyRes.isRight()) {
    return serviceErr(400, "验证 token 失败")
  }
  const { decoded } = verifyRes.left() as { decoded: JWTPayloadType }
  return serviceOk({ decoded })
}
