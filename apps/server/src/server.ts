import Express from "express"

import { routes } from "@/routers"
import { Errors, UnreachableError } from "@/errors"
import { logMiddleware } from "@/middlewares/log"
import { sessionMiddleware } from "@/middlewares/session"
import { newSocket } from "@/socket"

import z from "zod"

import cookieParser from "cookie-parser"

import "dotenv/config"

const _PORT = z.number().min(3000).max(65535).safeParse(process.env.PORT)
const PORT = _PORT.success ? _PORT.data : 8080

const app = Express()

app.get("/", (req, res) => {
  res.end("Hello World!")
})

app.use(cookieParser())
app.use(Express.json())
app.use(logMiddleware)
app.use(sessionMiddleware)

// register all routes
for (const route of routes) {
  app[route.method](`/api${route.path}`, route.handler)
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on:
    http://localhost:${PORT}
    http://127.0.0.1:${PORT}
`)
})

// Socket.io
newSocket()

server.on("error", (err) => {
  console.error("Server error", err)
})

server.on("close", () => {
  console.error(Errors.EXPRESS_EXIT_ABNORMALLY.toString())
  process.exit(Errors.EXPRESS_EXIT_ABNORMALLY.code)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
    console.log(Errors.NODE_SIGTERM.toString())
    process.exit(Errors.NODE_SIGTERM.code)
  })
  setTimeout(() => {
    console.error(Errors.NODE_SIGTERM_TIMEOUT.toString())
    process.exit(Errors.NODE_SIGTERM_TIMEOUT.code)
  }, 1000)
})

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
    console.log(Errors.NODE_SIGINT.toString())
    process.exit(Errors.NODE_SIGINT.code)
  })
  setTimeout(() => {
    console.error(Errors.NODE_SIGINT_TIMEOUT.toString())
    process.exit(Errors.NODE_SIGINT_TIMEOUT.code)
  }, 1000)
})

process.on("uncaughtException", (err) => {
  console.error(`${Errors.NODE_UNCAUGHT_EXCEPTION.message}: `, err)

  if (
    err instanceof UnreachableError &&
    process.env.NODE_ENV === "production"
  ) {
    return
  }
  process.exit(Errors.NODE_UNCAUGHT_EXCEPTION.code)
})
