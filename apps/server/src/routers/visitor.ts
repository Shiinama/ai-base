import type { Routes, ServerResponseBody } from "@/routers"
import { z } from "zod"
import { formatZodError } from "@/utils"
import { getUniqueVisitor, getUniqueVisitorByDay } from "@/services/visitor"

export const routes: Routes = [
  {
    method: "get",
    path: "/visitor/total",
    handler: async (req, res: ServerResponseBody) => {
      const totalRes = await getUniqueVisitor()
      return res.json(totalRes.unwrap())
    },
  },
  {
    method: "get",
    path: "/visitor/analytics",
    handler: async (req, res: ServerResponseBody) => {
      const queryScheme = z.object({
        day: z.number().min(7).max(30),
      })
      const query = queryScheme.safeParse(req.query)
      if (query.success === false) {
        return res.json({
          code: 400,
          ...formatZodError(query.error),
        })
      }
      const { day } = query.data
      const result = await getUniqueVisitorByDay(day)
      return res.json(result.unwrap())
    },
  },
]
