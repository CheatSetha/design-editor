import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"
import ContextMenu from "./components/ContextMenu"
import useAppContext from "~/hooks/useAppContext"
import NotFound from "~/constants/no-found"

 
const GraphicEditor = () => {
  const { currentUser, setCurrentUser } = useAppContext()
  if(currentUser === null){
    return <NotFound />
  }
  return (
    <EditorContainer>
      <Navbar />
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
