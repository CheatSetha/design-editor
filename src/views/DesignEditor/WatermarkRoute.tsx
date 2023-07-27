import useEditorType from "~/hooks/useEditorType"
import SelectEditor from "./SelectEditor"
import GraphicEditor from "./GraphicEditor"
import PresentationEditor from "./PresentationEditor"
import VideoEditor from "./VideoEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preview from "./components/Preview"
import ContextMenu from "./components/ContextMenu"
import { set } from "lodash"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import useAppContext from "~/hooks/useAppContext"
import { BASE_URl } from "~/constants/base-api"
import NotFound from "~/constants/no-found"

const DesignEditorWatermak = () => {
  const editorType = useEditorType()
  const { currentUser, setCurrentUser } = useAppContext()
  const location = useLocation()
  console.log(location.search, "location.pathname")
  const routedUrl = location.search
  const uuid = routedUrl.substring(1)

  const getUserinfo = async () => {
    const respone = await fetch(`${BASE_URl}/auth/check-uuid/${uuid}`)
    const data = await respone.json()
    console.log(data?.code, "data from uuid")
    if (data?.code === 200) {
      setCurrentUser(data)
    }
    if (data?.code !== 200) {
      setCurrentUser(null)
    }
  }
  console.log(currentUser, "currentUser")

  useEffect(() => {
    getUserinfo()
  }, [])

  const { displayPreview, setDisplayPreview, setEditorType } = useDesignEditorContext()
  setEditorType("GRAPHIC")
  if (currentUser === null) {
    return <NotFound />
  }

  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
      {
        {
          // NONE: <SelectEditor />,
          PRESENTATION: <PresentationEditor />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      }
    </>
  )
}

export default DesignEditorWatermak
