import type { Routes, ServerResponseBody } from "@/routers"
import { z } from "zod"
import { formatZodError } from "@/utils"
import { getPostLikes, likePost } from "@/services/post"

export const routes: Routes = [
  {
    method: "get",
    path: "/post/likes",
    handler: async (req, res: ServerResponseBody) => {
      const queryScheme = z.object({
        slug: z.string(),
      })
      const query = queryScheme.safeParse(req.query)
      if (query.success === false) {
        return res.json({
          code: 400,
          ...formatZodError(query.error),
        })
      }
      const { slug } = query.data
      const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress
      const likes = await getPostLikes(slug, userIp as string)
      return res.json(likes.unwrap())
    },
  },
  {
    method: "post",
    path: "/tag/create",
    handler: async (req, res: ServerResponseBody) => {
      const queryScheme = z.object({
        slug: z.string(),
      })
      const query = queryScheme.safeParse(req.query)
      if (query.success === false) {
        return res.json({
          code: 400,
          ...formatZodError(query.error),
        })
      }
      const { slug } = query.data
      const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress
      const result = await likePost(slug, userIp as string)
      return res.json(result.unwrap())
    },
  },
]
