import React, { useCallback, useContext, useEffect, useState } from "react"
import { Block } from "baseui/block"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { Carousel } from "react-responsive-carousel"
import { useEditor } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"
import Loading from "~/components/Loading"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import useDesignEditorUpload from "~/hooks/useDesignEditorUpload"
import { AppContext } from "~/contexts/AppContext"

const PreviewALl = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  //+++++++++++++++ test code ++++++++++++++++++++++++//
  const scences = useDesignEditorScenes()
  const { uploads, setUploads } = useContext(AppContext)
  console.log(scences, scences.length, "scences")

  const [images, setImages] = useState<{ id: string; preview: string }[]>([])
  const loadImage = useCallback(
    async (scences: IScene[]) => {
      const images = []
      for (const scene of scences) {
        const preview = (await editor.renderer.render(scene)) as string
        scene.preview = preview
        // console.log(preview, "preview v2")
        // images.push({
        //   id: scene.id,
        //   preview,
        // })
      }

      // setImages(images)
      setLoading(false)
    },
    [editor]
  )

  const addScene = React.useCallback(async () => {
    for (let i = 0; i < uploads.length; i++) {
      const { src, id } = uploads[i]
      const template = editor.scene.exportToJSON()
      const previewImg = JSON.parse(JSON.stringify(template))
      console.log(template, "template")

      // Push the modified image object to scenes array
      previewImg.id = id
      previewImg.layers[1].preview = src
      previewImg.layers[1].src = src
      previewImg.layers[1].id = id
      previewImg.preview = ""
      // console.log("image in scene already push", previewImg)
      // setScenes(image);
      //remove scence index 0

      scences.push(previewImg)
      console.log("all scenes ", scences)
    }
    scences.splice(0, 1)

    // remove all element in upload array
    setUploads([])
  }, [])

  // for (let i = 0; i < uploads.length; i++) {
  //   const { src, id } = uploads[i]
  //   const template = editor.scene.exportToJSON()
  //   const previewImg = JSON.parse(JSON.stringify(template))
  //   // console.log(template, "template")

  //   // Push the modified image object to scenes array
  //   previewImg.id = id
  //   previewImg.layers[1].preview = src
  //   previewImg.layers[1].src = src
  //   previewImg.layers[1].id = id
  //   previewImg.preview = ""
  //   // console.log("image in scene already push", previewImg)
  //   // setScenes(image);
  //   scences.push(previewImg)
  //   console.log("all scenes ", scences)
  // }

  useEffect(() => {
    addScene()
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
  }, [])
  if (scences.length === 0) {
    return <div className="w-full h-screen flex justify-center items-center text-5xl text-green-800">No Image</div>
  }

  return (
    <div>
      <div className="w-full">
        {loading ? (
          <Loading />
        ) : (
          <div className="">
           <div className="overflow-y-scroll p-5 h-screen w-[300px] flex flex-col gap-10">
           {scences.map((page, index) => (
              <img className="w-full rounded-[16px]" key={index} src={page.preview} />
              


            ))}
           </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewALl
