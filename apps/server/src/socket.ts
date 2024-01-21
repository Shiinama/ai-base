import { Server } from "socket.io"
import type { Socket } from "socket.io"
import { loge, logi } from "./logging"
import { createVisitor, getTotalVisitor } from "@/services/visitor"

export function newSocket() {
  const io = new Server(3333, {
    // options
    cors: {
      origin: "*.yuxi.site",
    },
  })

  io.on("connection", async (socket: Socket) => {
    const ip = socket.handshake.headers["x-real-ip"] || socket.handshake.address
    logi(`a user connected, current connections:, ${ip}`)
    const remoteIp = Array.isArray(ip) ? ip[0] : ip
    const createRes = await createVisitor(remoteIp)
    if (createRes.isRight()) {
      loge(`服务器发生错误, ${createRes.right()}`)
      return
    }
    const totalRes = await getTotalVisitor()
    if (totalRes.isRight()) {
      loge(`服务器发生错误, ${totalRes.right()}`)
      return
    }
    const total = totalRes.left()
    const sockets = await io.fetchSockets()
    const count = sockets.length
    logi(`Current online: ${count}`)
    socket.emit("count", { total, online: count })
    socket.broadcast.emit("count", { total, online: count })

    socket.on("disconnect", async () => {
      const sockets = await io.fetchSockets()
      const count = sockets.length

      logi(`A user disconnected, current connections:, ${count}`)
      socket.emit("count", { online: count })
      socket.broadcast.emit("count", { online: count })
    })
  })
}
