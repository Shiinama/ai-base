import type { Routes, ServerResponseBody } from "@/routers"
import { z } from "zod"
import { formatZodError, serviceOk } from "@/utils"
import { p } from "@/prisma"

export const routes: Routes = [
  {
    method: "get",
    path: "/hello",
    handler: async (req, res: ServerResponseBody) => {
      const users = await p.user.findMany()
      console.log(users)
      res.json(serviceOk("hello api").left())
    },
  },
]
