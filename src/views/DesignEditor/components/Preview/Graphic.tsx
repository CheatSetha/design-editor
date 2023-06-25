import React, { useCallback, useEffect, useState } from "react"
import { Block } from "baseui/block"
import { useEditor, useFrame } from "@layerhub-io/react"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { IScene } from "@layerhub-io/types"
import { Link } from "react-router-dom"
import useDesignEditorUpload from "~/hooks/useDesignEditorUpload"

const Graphic = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState({
    image: "",
  })

  //+++++++++++++++--------- test code ++++++++++++++++++++++++//

  const scences = useDesignEditorScenes()
  const uploads = useDesignEditorUpload()
  console.log(uploads, "uploads in preview context upload")
  const [images, setImages] = useState<{ id: string; preview: string }[]>([])
  // console.log(scences, "scences in preview ")
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

  // end of test code

  let template
  const makePreview = React.useCallback(async () => {
    if (editor) {
      template = editor.scene.exportToJSON()
      // console.log(template, "template")

      const image = (await editor.renderer.render(template)) as string

      setState({ image })
      setLoading(false)
    }
  }, [editor])

  React.useEffect(() => {
    makePreview()
  }, [editor])
  // console.log(state, "state image")

  return (
    <div className="w-full">
      <Link className="flex justify-center mt-5" to={"/previewall"}>
        <button
          type="button"
          className="text-white  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Preview more
        </button>
      </Link>

      <div className="flex justify-center p-2 items-center overflow-auto w-full mt-5"
        // $style={{
        //   alignItems: "center",
        //   justifyContent: "center",
        //   display: "flex",
        //   padding: "5rem",
        //   overflow: "auto",
        //   width: "100%",
        // }}
      >
        {!loading && <img className="w-auto h-[600px] " src={state.image} />}
      </div>
    </div>
  )
}

export default Graphic
