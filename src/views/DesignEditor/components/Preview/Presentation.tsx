import React, { useCallback, useEffect, useState } from "react"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { useEditor } from "@layerhub-io/react"
import { IScene } from "@layerhub-io/types"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import useDesignEditorUpload from "~/hooks/useDesignEditorUpload"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import loadinggif from "~/assets/loading/loading.gif"

const Presentation = () => {
  const [slides, setSlides] = React.useState<{ id: string; preview: string }[]>([])
  const scenes = useDesignEditorScenes()
  const editor = useEditor()
  const uploads = useDesignEditorUpload()
  const { setDisplayPreview } = useDesignEditorContext()
  const [loading, setLoading] = React.useState(false)
  const [images, setImages] = useState<{ id: string; preview: string }[]>([])
  console.log("upload context", uploads)
  const [currentIndex, setCurrentIndex] = useState(0)



  console.log(scenes,'scenes i love you');
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
  const [isLoading, setIsLoading] = useState(false)

  const handleSlideClick = (slide: any) => {
    // setSelectedSlide(slide)
    setCurrentIndex(slide)
  }
  useEffect(() => {
    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 7000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="flex w-full z-50  ">
      <button
        onClick={() => setDisplayPreview(false)}
        type="button"
        className="absolute right-4 pb-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        Close
      </button>
      {/* <div className="grid grid-cols-1 p-5 w-3/12 gap-5 overflow-auto">
        {slides.map((slide, index) => (
          <button key={index} onClick={()=>handleSlideClick(slide)}>
            <img className="w-40 " src={slide.preview} alt="preview image" />
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
          
          // {selectedSlide === null ? slides[0] : selectedSlide}
          src={selectedSlide ? selectedSlide?.preview : slides[0]?.preview}
          alt="selected image"
        />
      </div>
      {isLoading && (
         <div className="w-full h-screen fixed top-0 left-0 right-0 z-50 flex  items-center bg-white ">
         <img className="w-[400px] mx-auto  " src={loadinggif} alt="loading" />
       </div>
      )} */}

      <div className="w-full flex">
        <div className="bg-slate-100">
          <div id="scrollbar" className="overflow-y-scroll  p-5 h-screen w-[150px] flex flex-col gap-4">
            {slides &&
              slides.map((slide, i) => (
                <>
                  <img
                    key={i}
                    className={`${i === currentIndex ? "block" : "hidden"} w-5 h-5 z-50 -mb-[50px] ml-[75px]`}
                    src="https://cdn-icons-png.flaticon.com/512/992/992481.png"
                    alt=""
                  />

                  <img
                    onClick={() => handleSlideClick(i)}
                    className={`w-full  cursor-pointer rounded-[16px] ${
                      i === currentIndex ? "border-2 mt-3 border-blue-500" : ""
                    } ${i === slides?.length - 1 ? "mb-16" : ""}`}
                    key={i}
                    src={slide.preview}
                  />
                </>
              ))}
          </div>
        </div>
        <div className="flex justify-center p-2 items-center overflow-auto w-full mt-5">
          {!loading && <img className="w-auto h-[600px] " src={slides[currentIndex]?.preview} />}
          {loading && <img className="w-auto fixed top-0 right-0 left-0" src={loadinggif} />}
          
        </div>
      </div>
    </div>
  )
}

export default Presentation
