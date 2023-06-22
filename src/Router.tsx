import { BrowserRouter, Routes, Route } from "react-router-dom"
import DesignEditor from "~/views/DesignEditor"
import Dashboard from "~/views/Dashboard"
import PreviewALl from "./views/DesignEditor/components/Preview/TestPreview"

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/manage" element={<Dashboard />} />
        <Route path="/" element={<DesignEditor />} />
        <Route path="/previewall" element={<PreviewALl />} />

      </Routes>
    </BrowserRouter>
  )
}

export default Router
