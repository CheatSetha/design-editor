import React, { useState } from "react"
import { Block } from "baseui/block"
import { useEditor } from "@layerhub-io/react"
import { useSelector } from "react-redux"
import { selectUploads } from "~/store/slices/uploads/selectors"
import { template } from "lodash"
import { selectDesigns } from "~/store/slices/designs/selectors"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { Root } from "react-dom/client"
// import { setImages } from "~/store/slices/images/imagesSlice"

const Graphic = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState({
    image: "",
  })

  //+++++++++++++++--------- test code ++++++++++++++++++++++++//
  const scences = useDesignEditorScenes()
  console.log(scences, "scences in preview ")
  const [upload, setUpload] = useState([])
  const images = useSelector(selectDesigns)
  console.log(images, "images")

  // end of test code

  let template
  const makePreview = React.useCallback(async () => {
    if (editor) {
      template = editor.scene.exportToJSON()
      console.log(template, "template")

      const image = (await editor.renderer.render(template)) as string

      setState({ image })
      setLoading(false)
    }
  }, [editor])

  React.useEffect(() => {
    makePreview()
  }, [editor])
  console.log(state, "state image")

  return (
    <Block
      $style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        padding: "5rem",
        overflow: "auto",
      }}
    >
      {!loading && <img width="auto" height="100%" src={state.image} />}

      {/* {scences && scences.map((s, index) => <img key={index} width="auto" height="100%" src={s.layers[1].src} />)} */}
    </Block>
  )
}

export default Graphic
