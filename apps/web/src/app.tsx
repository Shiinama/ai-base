import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import "@ai-base/ui"
import Home from "./pages/home"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import GuidePage from "./pages/guide"
import useResize from "./hooks/useResize"
import ChatPage from "./pages/chat"

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
})

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/guide" />} />
    </Routes>
  )
}

export default function WrappedApp() {
  useResize()
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  )
}
