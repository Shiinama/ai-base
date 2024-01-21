import { p } from "@/prisma"
import { serviceErr, serviceOk, capturePrismaWithServiceResult } from "@/utils"

/**
 * getCategoryList
 * @description Get category list
 */
export async function getCategoryList() {
  return capturePrismaWithServiceResult(() => p.category.findMany())
}

/**
 * createCategory
 * @description Create a category
 * @param name
 * @returns
 */
export async function createCategory(name: string) {
  return capturePrismaWithServiceResult(() =>
    p.category.create({
      data: {
        name,
      },
    }),
  ).then(async (it) => {
    if (it.isRight()) {
      return serviceErr(400, "创建分类失败", it.right())
    }
    return serviceOk(null)
  })
}

/**
 * deleteCategory
 * @description Delete a category
 * @param id
 * @returns
 */
export async function deleteCategory(id: number) {
  return capturePrismaWithServiceResult(() =>
    p.category.delete({
      where: {
        id,
      },
    }),
  ).then(async (it) => {
    if (it.isRight()) {
      return serviceErr(400, "删除分类失败", it.right())
    }
    return serviceOk(null)
  })
}
