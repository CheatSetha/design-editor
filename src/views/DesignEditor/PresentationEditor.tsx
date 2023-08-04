import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"
import NotFound from "~/constants/no-found"
import useAppContext from "~/hooks/useAppContext"
import Loading from "~/components/Loading"
import Unauthorized from "~/utils/Unauthorized"
import { useEffect } from "react"
import { toast } from "react-hot-toast"

const PresentationEditor = ({uuid}) => {
  const { currentUser } = useAppContext()
  if (currentUser === null) {
    return <Loading />
  }
  return (
    <EditorContainer>
      <Navbar uuid={uuid}/>
      <div style={{ display: "flex", flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Toolbox />
          <Canvas />
          <Footer />
        </div>
      </div>
    </EditorContainer>
  )
}

export default PresentationEditor
