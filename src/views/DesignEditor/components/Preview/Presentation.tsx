import React, { useCallback, useState } from "react"
import { Block } from "baseui/block"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { Carousel } from "react-responsive-carousel"
import { useEditor } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"
import Loading from "~/components/Loading"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import useDesignEditorUpload from "~/hooks/useDesignEditorUpload"

const Presentation = () => {
  const [slides, setSlides] = React.useState<{ id: string; preview: string }[]>([])
  const scenes = useDesignEditorScenes()
  const editor = useEditor()
  const uploads = useDesignEditorUpload()
  const [loading, setLoading] = React.useState(true)
  const [images , setImages]= useState<{id:string,preview:string}[]>([])
console.log('upload context', uploads);
  const loadSlides = React.useCallback(
    async (scenes: IScene[]) => {
      console.log("scenes index 0", scenes[0]);
      const slides = []
      for (const scene of scenes) {
        const preview = (await editor.renderer.render(scene)) as string
        slides.push({
          
          id: scene.id,
          preview,
        })
      }
      setSlides(slides)
      setLoading(false)
    },
    [editor]
  )
  const loadImages = React.useCallback(
    async () => {
      const images = []
      for (const img of uploads) {
        const preview = img.preview
        
        images.push({
          id: img.id,
          preview,
        })
      }
      setImages(images)
      setLoading(false)
    },
    [editor]
  )
  console.log("img", images)

  React.useEffect(() => {
    if (scenes && editor) {
      const currentScene = editor.scene.exportToJSON()
      const updatedScenes = scenes.map((scene) => {
        if (scene.id === currentScene.id) {
          return currentScene
        }
        return scene
      })
      loadSlides(updatedScenes)
    }
    if(uploads && editor){
      const currentImage = editor.scene.exportToJSON()
      const updatedImages = uploads.map((img) => {
        if (img.id === currentImage.id) {
          return currentImage
        }
        return img
      })
      loadImages(updatedImages)
    }
  }, [editor, scenes])

  return (
    <Block
      $style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        position: "relative",
      }}
    >
      <Block $style={{ position: "absolute"}}>
        {loading ? (
          <Loading /> 
        ) : (
          // <Carousel showIndicators={false} showThumbs={false} useKeyboardArrows={true} showStatus={false}>
          //   {slides.map((page, index) => (
          //     <img width="auto" height="100%" key={index} src={page.preview} />
          //   ))}
          // </Carousel>



        < Block className="w-full h-screen flex gap-5 flex-wrap">
          {
             slides.map((page, index) => (
              <img className="w-64" src={page.preview} alt="preview imiage" key={index} />
            
              ))
          }
           </Block>

        )}
      </Block>
    </Block>
  )
}

export default Presentation
