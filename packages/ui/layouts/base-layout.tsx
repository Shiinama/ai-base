import { Button } from "@chakra-ui/react"
import React from "react"

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black">
      <Button>12312</Button>
      {children}
    </div>
  )
}
