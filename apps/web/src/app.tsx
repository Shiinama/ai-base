import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Home from "./pages/home"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import useResize from "./hooks/useResize"
import GuidePage from "./pages/guide"

const theme = extendTheme({
  config: {
    initialColorMode: "light",
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
  // While the blocklet is deploy to a sub path, this will be work properly.
  useResize()
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  )
}
