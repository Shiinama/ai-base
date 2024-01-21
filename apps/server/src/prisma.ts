import { PrismaClient, Prisma } from "@prisma/client"

const p = new PrismaClient({ log: ["warn", "error"] })

export { p, Prisma }
