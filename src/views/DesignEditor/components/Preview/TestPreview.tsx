import React, { useCallback, useEffect, useState } from "react"
import { Block } from "baseui/block"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { Carousel } from "react-responsive-carousel"
import { useEditor } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"
import Loading from "~/components/Loading"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const PreviewALl = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)

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

  return (
    <>
    
    <h1>Total Images {images.length}</h1>
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap gap-5">
          {images.map((image, i) => (
            <img className="w-64" key={i} src={image.preview} alt="preview" />
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default PreviewALl
