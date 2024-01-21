import { p } from "@/prisma"
import {
  capturePrisma,
  capturePrismaWithServiceResult,
  serviceErr,
} from "@/utils"

export async function likePost(postSlug: string, userIp: string) {
  const checkRes = await capturePrisma(() =>
    p.userLike.findUnique({
      where: { userIp_slug: { userIp: userIp, slug: postSlug } },
    }),
  )

  if (checkRes.isRight) {
    return serviceErr(500, "服务器错误", checkRes.right())
  }

  if (checkRes.left()) {
    return serviceErr(400, "你已经点赞过了")
  }

  return capturePrismaWithServiceResult(() =>
    p.post.upsert({
      where: { slug: postSlug },
      update: { likes: { increment: 1 } },
      create: { slug: postSlug, likes: 1 },
    }),
  )
}

export async function getPostLikes(postSlug: string, userIp: string) {
  const checkRes = await capturePrisma(() =>
    p.userLike.findUnique({
      where: { userIp_slug: { userIp: userIp, slug: postSlug } },
    }),
  )

  if (checkRes.isRight) {
    return serviceErr(500, "服务器错误", checkRes.right())
  }

  return capturePrismaWithServiceResult(() =>
    p.post
      .findUnique({
        where: { slug: postSlug },
        select: { likes: true },
      })
      .then((res) => {
        return { likes: res?.likes || 0, liked: checkRes.left() !== null }
      }),
  )
}
