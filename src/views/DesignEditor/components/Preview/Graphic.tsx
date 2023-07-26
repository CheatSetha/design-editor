import React, { useCallback, useEffect, useState } from "react"
import { useEditor, useFrame } from "@layerhub-io/react"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { IScene } from "@layerhub-io/types"
import { Link } from "react-router-dom"
import useDesignEditorUpload from "~/hooks/useDesignEditorUpload"
import useAppContext from "~/hooks/useAppContext"

const Graphic = () => {
  const editor = useEditor()
   const [currentIndex, setCurrentIndex] = useState(0)

  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState({
    image: "",
  })
  const { uploadTemp } = useAppContext()
  console.log(uploadTemp, "uploadTemp")
  const listOfurl = uploadTemp?.url

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

  let template: any

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

let template2: any
  const makePreview2 = async (currentIndex: number) => {
    setCurrentIndex(currentIndex)
    template2 = editor.scene.exportToJSON()
    console.log(template2, "template2")
    const oldPreview = template2.layers[1]?.preview
    const newPreview = listOfurl[currentIndex]
    // const newPreview = blobList[currentIndex]
    //replace oldPreview with another image
    template2.layers[1].preview = newPreview
    template2.layers[1].src = newPreview
    console.log(template2.layers[1].preview, "setha")

    const image = (await editor.renderer.render(template2)) as string
    setState({ image })
  }

  useEffect(() => {
    makePreview2(currentIndex)
  }, [currentIndex])

  return (
    <div className="w-full flex">
      <div className="bg-slate-100">
            <div id="scrollbar" className="overflow-y-scroll  p-5 h-screen w-[150px] flex flex-col gap-4">
              {listOfurl &&
                listOfurl.map((url: string, i: number) => (
                  <>
                    <img
                      className={`${i === currentIndex ? "block" : "hidden"} w-5 h-5 z-50 -mb-[50px] ml-[75px]`}
                      src="https://cdn-icons-png.flaticon.com/512/992/992481.png"
                      alt=""
                    />

                    <img
                      onClick={(e) => makePreview2(i)}
                      className={`w-full  cursor-pointer rounded-[16px] ${
                        i === currentIndex ? "border-2 mt-3 border-blue-500" : ""
                      } ${i === listOfurl?.length - 1 ? "mb-16" : ""}`}
                      key={i}
                      src={url}
                    />
                  </>
                ))}
            </div>
      </div>
      <div className="flex justify-center p-2 items-center overflow-auto w-full mt-5">
        {!loading && <img className="w-auto h-[600px] " src={state.image} />}
      </div>
    </div>
  )
}

export default Graphic
