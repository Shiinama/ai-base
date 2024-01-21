export class UnreachableError extends Error {
  constructor(message: string) {
    super(`We MUST never end up here.\n${message}`)
  }

  static assertNever(_val: never, message: string): never {
    throw new UnreachableError(message)
  }

  static assertNeverAsync(_val: never, message: string): Promise<never> {
    return Promise.reject(new UnreachableError(message))
  }

  static unreachable(message: string): never {
    throw new UnreachableError(message)
  }
}

export class ServerError extends Error {
  public readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
  }

  [Symbol.toStringTag] = "ServerError";
  [Symbol.toPrimitive](hint: string) {
    if (hint === "number") {
      return this.code
    }
    return `Error #${this.code}: ${this.message}`
  }

  override toString() {
    return `Error #${this.code}: ${this.message}`
  }
}

export const Errors = Object.freeze({
  // NODE related
  get NODE_UNCAUGHT_EXCEPTION() {
    return new ServerError(100, "Uncaught exception")
  },

  get NODE_SIGINT() {
    return new ServerError(101, "SIGINT signal received")
  },
  get NODE_SIGINT_TIMEOUT() {
    return new ServerError(
      102,
      "SIGINT signal received but server close timeout",
    )
  },
  get NODE_SIGTERM() {
    return new ServerError(103, "SIGTERM signal received")
  },
  get NODE_SIGTERM_TIMEOUT() {
    return new ServerError(
      104,
      "SIGTERM signal received but server close timeout",
    )
  },

  // db related
  get DB_CONNECT_FAILED() {
    return new ServerError(201, "Unable to connect to the database")
  },
  // express related
  get EXPRESS_EXIT_ABNORMALLY() {
    return new ServerError(301, "Server closed abnormally")
  },

  // sensors related
  get SENSORS_ENV_NOT_SET() {
    return new ServerError(
      401,
      "Environment variable LOCATION_SERVER_URL not set",
    )
  },

  // session related
  get SESSION_INVALID_TOKEN() {
    return new ServerError(501, "Session invalid TOKEN")
  },
  get SESSION_USER_BAN() {
    return new ServerError(502, "User is banned")
  },
  get SESSION_UNAUTHORIZED() {
    return new ServerError(503, "Unauthorized")
  },
} as const)
