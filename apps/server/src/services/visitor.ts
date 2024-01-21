import { p } from "@/prisma"
import { capturePrisma, capturePrismaWithServiceResult } from "@/utils"

// 查询总访问量
export async function getTotalVisitor() {
  return capturePrisma(() =>
    p.visitor
      .findMany({
        distinct: ["ip"],
      })
      .then((res) => res.length),
  )
}

// 查询总访问量给接口用
export async function getUniqueVisitor() {
  return capturePrismaWithServiceResult(() =>
    p.visitor
      .findMany({
        distinct: ["ip"],
      })
      .then((res) => res.length),
  )
}

// 查询最近几天内，每天的访问量
export async function getUniqueVisitorByDay(len: number) {
  const date = new Date()
  date.setDate(date.getDate() - len)

  return capturePrismaWithServiceResult(() =>
    p.visitor
      .findMany({
        where: {
          createdAt: {
            gte: date,
          },
        },
        select: {
          ip: true,
          createdAt: true,
        },
        distinct: ["ip"],
        orderBy: {
          createdAt: "asc",
        },
      })
      .then((res) => {
        const map = new Map<string, number>()
        res.forEach((v) => {
          const date = v.createdAt.toISOString().split("T")[0]
          const count = map.get(date) || 0
          map.set(date, count + 1)
        })
        return [...map.entries()]
      }),
  )
}

// 创建访问记录
export async function createVisitor(ip: string) {
  return capturePrisma(() =>
    p.visitor.create({
      data: {
        ip,
      },
    }),
  )
}
