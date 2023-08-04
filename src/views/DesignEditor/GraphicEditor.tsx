import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"
import useAppContext from "~/hooks/useAppContext"
import Loading from "~/components/Loading"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Unauthorized from "~/utils/Unauthorized"
import NotFound from "~/NotFound"

const GraphicEditor = ({uuid}) => {
  const { currentUser } = useAppContext()
  if (currentUser === null) {
    return  <Loading />
  }
  return (
    <EditorContainer>
      <Navbar uuid={uuid}/>
      <div style={{ display: "flex", flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <Toolbox />
          <Canvas />
          <Footer />
        </div>
      </div>
    </EditorContainer>
  )
}

export default GraphicEditor
