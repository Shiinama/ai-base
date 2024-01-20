import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Home from "./pages/home"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import GuidePage from "./pages/guide"
import useResize from "./hooks/useResize"

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
