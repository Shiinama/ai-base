import { p } from "@/prisma"
import { serviceErr, serviceOk, capturePrismaWithServiceResult } from "@/utils"

/**
 * getTagList
 * @description Get tag list
 */
export async function getTagList() {
  return capturePrismaWithServiceResult(() => p.tag.findMany())
}

/**
 * createTag
 * @description Create a tag
 * @param name
 * @returns
 */
export async function createTag(name: string) {
  return capturePrismaWithServiceResult(() =>
    p.tag.create({
      data: {
        name,
      },
    }),
  ).then(async (it) => {
    if (it.isRight()) {
      return serviceErr(400, "创建标签失败", it.right())
    }
    return serviceOk(null)
  })
}

/**
 * deleteTag
 * @description Delete a tag
 * @param id
 * @returns
 */
export async function deleteTag(id: number) {
  return capturePrismaWithServiceResult(() =>
    p.tag.delete({
      where: {
        id,
      },
    }),
  ).then(async (it) => {
    if (it.isRight()) {
      return serviceErr(400, "删除标签失败", it.right())
    }
    return serviceOk(null)
  })
}
