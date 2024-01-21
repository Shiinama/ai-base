import { p } from "@/prisma"
import md5 from "md5"
import {
  capturePrisma,
  capturePrismaWithServiceResult,
  Either,
  serviceErr,
  serviceOk,
} from "@/utils"
import { ErrorBody } from "@/routers"
import { generateJWT } from "@/services/token"

export type User = {
  id: number
  name: string
  password: string
  username: string
  createdAt: Date
  updatedAt: Date
}

/**
 * 根据 username 查找用户
 * @param username 用户名
 * @returns 用户信息
 *
 */
async function findUserByUsername(username: string): Promise<User> {
  return p.user.findFirst({
    where: {
      username,
    },
  })
}

/**
 * 根据 id 查找用户
 * @param id 用户 id
 * @returns User
 */
export async function findUserById(id: number) {
  return capturePrisma(() =>
    p.user.findFirst({
      where: {
        id,
      },
    }),
  ).then((it) => {
    if (it.isRight()) {
      return it.mapRight((err) => {
        err.message = "用户不存在"
        return err
      })
    }
    return it
  })
}

export async function updateUserPassword(
  userId: number,
  oldPassword: string,
  newPassword: string,
) {
  const findUserByIdResult = await findUserById(userId)
  if (findUserByIdResult.isRight()) {
    return findUserByIdResult as Either<any, ErrorBody>
  }

  const user = findUserByIdResult.left()
  if (user.password !== oldPassword) {
    return serviceErr(400, "原密码错误")
  }

  const result = await capturePrismaWithServiceResult(() =>
    p.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    }),
  )

  if (result.isRight()) {
    return serviceErr(400, "密码修改失败", result.right())
  }
  return serviceOk(null)
}

export async function resetPassword(id: number) {
  return capturePrismaWithServiceResult(() =>
    p.user.update({
      where: {
        id: id,
      },
      data: {
        password: md5("123qwe"),
      },
    }),
  ).then(async (it) => {
    if (it.isRight()) {
      return serviceErr(400, "密码重置失败", it.right())
    }
    return serviceOk(null)
  })
}

/**
 * 获取用户信息
 * @param id 用户 id
 * @returns 用户信息
 */
export async function getUserInfo(id: number) {
  const findUserByIdResult = await findUserById(id)

  if (findUserByIdResult.isRight()) {
    return serviceErr(400, "用户不存在", findUserByIdResult.right())
  }
  const user = findUserByIdResult.left()
  return serviceOk({
    id: user.id,
    name: user.name,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @returns token
 */
export async function login({
  username,
  password,
}: {
  username: string
  password: string
  fromApp?: boolean
}) {
  const user = await findUserByUsername(username)
  if (!user) {
    return serviceErr(400, "账号错误")
  }
  if (user.password !== password) {
    return serviceErr(400, "密码错误")
  }

  const token = generateJWT({ user, expiresIn: "7d" })

  if (token.isRight()) {
    return serviceErr(500, "登录失败")
  }

  return serviceOk({
    token: token.left().data,
  })
}
