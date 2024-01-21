import type { Routes, ServerResponseBody } from "@/routers"
import { z } from "zod"
import { formatZodError } from "@/utils"
import {
  createCategory,
  deleteCategory,
  getCategoryList,
} from "@/services/category"

export const routes: Routes = [
  {
    method: "get",
    path: "/category/list",
    handler: async (req, res: ServerResponseBody) => {
      const tags = await getCategoryList()
      return res.json(tags.unwrap())
    },
  },
  {
    method: "post",
    path: "/category/create",
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
      const result = await createCategory(name)
      return res.json(result.unwrap())
    },
  },
  {
    method: "post",
    path: "/category/delete",
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
      const result = await deleteCategory(id)
      return res.json(result.unwrap())
    },
  },
]
