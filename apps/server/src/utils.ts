import type { ZodError, ZodFormattedError } from "zod"
import type { SuccessBody, ErrorBody } from "@/routers"

import { UnreachableError } from "@/errors"

import { Prisma } from "@prisma/client"

type PrismaError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientRustPanicError

export function formatZodError(error: ZodError): {
  message: string
  errors: ZodFormattedError<any>
} {
  const message = error.issues[0]?.message ?? "参数错误"
  return {
    message,
    errors: error.format(),
  }
}

/**
 * @description Either type
 */
export class Either<A, B> {
  private constructor(
    private a: A | null,
    private b: B | null,
    private index: 0 | 1,
  ) {}

  static left<A, B>(a: A): Either<A, B> {
    return new Either<A, B>(a, null, 0)
  }

  static right<A, B>(b: B): Either<A, B> {
    return new Either<A, B>(null, b, 1)
  }

  static from<A, B>(another: Either<A, B>) {
    return new Either<A, B>(another.a, another.b, another.index)
  }

  isLeft(): boolean {
    return this.index === 0
  }

  isRight(): boolean {
    return this.index === 1
  }

  left(): A {
    if (this.isRight()) {
      throw new Error("Either is not left")
    }
    return this.a as A
  }

  right(): B {
    if (this.isLeft()) {
      throw new Error("Either is not right")
    }
    return this.b as B
  }

  tryLeft(): A | null {
    return this.a
  }

  tryRight(): B | null {
    return this.b
  }

  mapLeft<C>(fun: (a: A) => C): Either<C, B> {
    if (this.isLeft()) {
      return Either.left(fun(this.a as A))
    }
    UnreachableError.unreachable("Either is not left")
  }

  mapRight<C>(fun: (b: B) => C): Either<A, C> {
    if (this.isRight()) {
      return Either.right(fun(this.b as B))
    }
    UnreachableError.unreachable("Either is not right")
  }

  unwrap(): A | B {
    if (this.isLeft()) {
      return this.a as A
    }
    return this.b as B
  }
}

export function serviceOk<T>(data: T): Either<SuccessBody<T>, ErrorBody> {
  return Either.left({
    code: 200,
    data,
  })
}

export function serviceErr<T>(
  code: ErrorBody["code"],
  message: string,
  base?: ErrorBody,
): Either<SuccessBody<T>, ErrorBody> {
  if (base) {
    return Either.right({
      ...base,
      code,
      message,
    })
  }

  return Either.right({
    code,
    message,
  })
}

/**
 * Capture errors from Prisma
 * @description This function should never throw
 * @param fun
 */
export async function capturePrismaWithServiceResult<D = any>(
  fun: () => Promise<D>,
): Promise<Either<SuccessBody<D>, ErrorBody>> {
  return capturePrisma(fun).then((result) => {
    if (result.isLeft()) {
      return serviceOk(result.left())
    }
    return serviceErr(
      result.right().code,
      result.right().message,
      result.right(),
    )
  })
}

export async function capturePrisma<D = any>(
  fun: () => Promise<D>,
): Promise<Either<D, ErrorBody>> {
  try {
    const result = await fun()
    return Either.left(result)
  } catch (__error: unknown) {
    const _error = __error as PrismaError

    if (_error instanceof Prisma.PrismaClientKnownRequestError) {
      const error = _error as Prisma.PrismaClientKnownRequestError
      // A unique constraint was violated on a model.
      if (error.code === "P2002") {
        const target = error.meta.target as any
        const field = Array.isArray(target)
          ? target.join(",")
          : target.toString()
        const message = `字段${field}已存在`
        return Either.right({
          code: 400,
          message: message + error.message,
          rawError: error,
        })
      } else if (error.code === "P2025") {
        const message = `字段${error.meta.target}不存在`
        return Either.right({
          code: 400,
          message: message + error.message,
          rawError: error,
        })
      }

      return Either.right({
        code: 400,
        message: `${error.code}: ${error.message}`,
        rawError: error,
      })
    } else if (_error instanceof Prisma.PrismaClientValidationError) {
      const error = _error as Prisma.PrismaClientValidationError
      return Either.right({
        code: 500,
        message: error.message,
        rawError: error,
      })
    } else if (_error instanceof Prisma.PrismaClientInitializationError) {
      const error = _error as Prisma.PrismaClientInitializationError
      return Either.right({
        code: 500,
        message: error.message,
        rawError: error,
      })
    } else if (_error instanceof Prisma.PrismaClientRustPanicError) {
      const error = _error as Prisma.PrismaClientRustPanicError
      return Either.right({
        code: 500,
        message: error.message,
        rawError: error,
      })
    } else if (_error instanceof Prisma.PrismaClientUnknownRequestError) {
      const error = _error as Prisma.PrismaClientUnknownRequestError
      return Either.right({
        code: 500,
        message: error.message,
        rawError: error,
      })
    } else {
      return Either.right({
        code: 500,
        message: "未知错误",
        rawError: _error,
      })
    }
  }
}

/**
 * Capture errors and map them to another type
 * @param fun
 * @param errorMapper
 */
export function capture<R, E>(fun: () => R, errorMapper?: (e: unknown) => E) {
  try {
    return Either.left(fun())
  } catch (error: unknown) {
    if (errorMapper) {
      return Either.right(errorMapper(error))
    }
    return Either.right(error as E)
  }
}

/**
 * Capture errors and map them to another type in async context
 * @param fun
 * @param errorMapper
 */
export function captureAsync<R, E>(
  fun: () => Promise<R>,
  errorMapper?: (e: unknown) => E,
) {
  return fun().then(
    (result) => Either.left(result),
    (error) => {
      if (errorMapper) {
        return Either.right(errorMapper(error))
      }
      return Either.right(error as E)
    },
  )
}
