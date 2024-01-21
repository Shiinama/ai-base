import type { Routes, ServerResponseBody } from "@/routers"
import { z } from "zod"
import { formatZodError } from "@/utils"
import { createTag, deleteTag, getTagList } from "@/services/tag"

export const routes: Routes = [
  {
    method: "get",
    path: "/tag/list",
    handler: async (req, res: ServerResponseBody) => {
      const tags = await getTagList()
      return res.json(tags.unwrap())
    },
  },
  {
    method: "post",
    path: "/tag/create",
    handler: async (req, res: ServerResponseBody) => {
      const bodySchema = z.object({
        name: z.string().min(1).max(20),
      })
      const body = bodySchema.safeParse(req.body)
      if (body.success === false) {
        return res.json({
          code: 400,
          ...formatZodError(body.error),
        })
      }
      const { name } = body.data
      const result = await createTag(name)
      return res.json(result.unwrap())
    },
  },
  {
    method: "post",
    path: "/tag/delete",
    handler: async (req, res: ServerResponseBody) => {
      const bodySchema = z.object({
        id: z.number(),
      })
      const body = bodySchema.safeParse(req.body)
      if (body.success === false) {
        return res.json({
          code: 400,
          ...formatZodError(body.error),
        })
      }
      const { id } = body.data
      const result = await deleteTag(id)
      return res.json(result.unwrap())
    },
  },
]
