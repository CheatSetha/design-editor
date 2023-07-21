import { BrowserRouter, Routes, Route } from "react-router-dom"
import DesignEditor from "~/views/DesignEditor"
import Dashboard from "~/views/Dashboard"
import PreviewALl from "./views/DesignEditor/components/Preview/TestPreview"

import DesignEditorWatermak from "./views/DesignEditor/WatermarkRoute"
import DesignEditorCertificate from "./views/DesignEditor/Certificate"


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/manage" element={<Dashboard />} />
        <Route path="/" element={<DesignEditor />} />
        {/* <Route path="/previewall" element={<PreviewALl />} /> */}
        <Route path="/watermark" element={<DesignEditorWatermak />} />
        <Route path="/generatecertificate" element={<DesignEditorCertificate/>} />


      </Routes>
    </BrowserRouter>
  )
}

export default Router
