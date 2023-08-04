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
import { toast } from "react-hot-toast"
import Loading from "~/components/Loading"

const DesignEditorWatermak = () => {
  const editorType = useEditorType()
  const { currentUser, setCurrentUser } = useAppContext()
  const location = useLocation()
  const routedUrl = location.search
  const uuid = routedUrl.substring(1)

  const getUserinfo = async () => {
    const respone = await fetch(`${BASE_URl}/auth/check-uuid/${uuid}`)
    const data = await respone.json()

    if (data?.code === 200) {
      setCurrentUser(data)
    }
    if (data?.code !== 200) {
      setCurrentUser(null)
    }
  }
  

  useEffect(() => {
    getUserinfo()
   
  }, [])

  const { displayPreview, setDisplayPreview, setEditorType } = useDesignEditorContext()
  setEditorType("GRAPHIC")
  if (currentUser === null) {
    return <Loading />
  }

  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
      {
        {
          // NONE: <SelectEditor />,
          PRESENTATION: <PresentationEditor uuid={uuid} />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor uuid={uuid} />,
        }[editorType]
      }
    </>
  )
}

export default DesignEditorWatermak
