import React, { useCallback, useEffect, useState } from "react"
import { Block } from "baseui/block"
import { useEditor } from "@layerhub-io/react"
import { useSelector } from "react-redux"
import { selectUploads } from "~/store/slices/uploads/selectors"
import { template } from "lodash"
import { selectDesigns } from "~/store/slices/designs/selectors"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { Root } from "react-dom/client"
import { IScene } from "@layerhub-io/types"
import { Link } from "react-router-dom"
// import { setImages } from "~/store/slices/images/imagesSlice"

const Graphic = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState({
    image: "",
  })

  //+++++++++++++++--------- test code ++++++++++++++++++++++++//

  const scences = useDesignEditorScenes()
  const [images, setImages] = useState<{ id: string; preview: string }[]>([])
  console.log(scences, "scences in preview ")
  const loadImage = useCallback(
    async (scences: IScene[]) => {
      const images = []
      for (const scene of scences) {
        const preview = (await editor.renderer.render(scene)) as string
        images.push({
          id: scene.id,
          preview,
        })
      }
      setImages(images)
      setLoading(false)
    },
    [editor]
  )
  useEffect(() => {
    if (scences && editor) {
      const currentScene = editor.scene.exportToJSON()
      const updatedScences = scences.map((scene) => {
        if (scene.id === currentScene.id) {
          return currentScene
        }
        return scene
      })
      loadImage(updatedScences)
    }
  }, [editor, scences])

  console.log(images, "images in preview version 2")
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
    <div>
      <Link className="flex justify-center mt-5" to={"/previewall"}>
        <button
          type="button"
          className="text-white  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Preview more
        </button>
      </Link>

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
    </div>
  )
}

export default Graphic
