const { PrismaClient, Prisma } = require("@prisma/client")
const md5 = require("md5")

const prisma = new PrismaClient()

const userData = [
  {
    id: 1, // 固定 id 为 1
    name: "admin",
    username: "admin",
    password: md5("123qwe"),
  },
]

async function main() {
  console.log(`Start seeding ...`)
  console.log(`Seeding users ...`)
  for (const u of userData) {
    const isExist = await prisma.user.findUnique({
      where: {
        username: u.username,
      },
    })
    if (isExist) continue
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
