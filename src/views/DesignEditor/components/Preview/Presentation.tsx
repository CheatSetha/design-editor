import React, { useCallback, useEffect, useState } from "react"
import { Block } from "baseui/block"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { Carousel } from "react-responsive-carousel"
import { useEditor } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"
import Loading from "~/components/Loading"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import useDesignEditorUpload from "~/hooks/useDesignEditorUpload"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import loadinggif from "~/assets/loading/loading.gif"
const Presentation = () => {
  const [slides, setSlides] = React.useState<{ id: string; preview: string }[]>([])
  const scenes = useDesignEditorScenes()
  const editor = useEditor()
  const uploads = useDesignEditorUpload()
  const {setDisplayPreview} =useDesignEditorContext()
  const [loading, setLoading] = React.useState(false)
  const [images, setImages] = useState<{ id: string; preview: string }[]>([])
  console.log("upload context", uploads)
  const loadSlides = React.useCallback(
    async (scenes: IScene[]) => {
      setLoading(false)
      // console.log("scenes index 0", scenes[0]);
      const slides = []
      for (const scene of scenes) {
        const preview = (await editor.renderer.render(scene)) as string

        slides.push({
          id: scene.id,
          preview,
        })
      }

      setSlides(slides)
    },
    [editor]
  )
  const loadImages = React.useCallback(async () => {
    setLoading(true)
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
  }, [editor])
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
    if (uploads && editor) {
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
  const [selectedSlide, setSelectedSlide] = useState(null)
  const [isLoading, setIsLoading] = useState(false);


  const handleSlideClick = (slide:any) => {
    setSelectedSlide(slide)

  }
  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 7000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex mt-20 z-50  ">
      <button onClick={()=>setDisplayPreview(false)} type="button" className="absolute right-4 pb-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Close</button>
      <div className="grid grid-cols-1 p-5 w-3/12 gap-5 overflow-auto">
        {slides.map((slide, index) => (
          <button key={index} onClick={()=>handleSlideClick(slide)}>
            <img className="w-40" src={slide.preview} alt="preview image" />
          </button>
        ))}
      </div>

      <div className="mx-auto">
 
        <img
          className="w-[60%] mx-auto transition-opacity duration-500 ease-in-out"
          style={{
            opacity: 0,
            transform: 'translateY(-10px)',
          }}
          onLoad={(e) => {
  
            e.target.style.opacity = 1;
            e.target.style.transform = 'translateY(0)';
          }}
          // {selectedSlide === null ? slides[0] : selectedSlide}
          src={selectedSlide ? selectedSlide?.preview : slides[0]?.preview}
      
          alt="selected image"
        />
      </div>
      {isLoading && (
         <div className="w-full h-screen absolute z-50 flex  items-center bg-white ">
         <img className="w-[400px] mx-auto  " src={loadinggif} alt="loading" />
       </div>
      )}
  </div>
  )
}

export default Presentation
