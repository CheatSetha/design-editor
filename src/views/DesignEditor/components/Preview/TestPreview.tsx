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
import { Link, useNavigate } from "react-router-dom"
import { DesignEditorContext } from "~/contexts/DesignEditor"

const PreviewALl = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }
  //+++++++++++++++ test code ++++++++++++++++++++++++//
  const scences = useDesignEditorScenes()
  const { currentScene, setCurrentScene } = useContext(DesignEditorContext)
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


  //handle slice first element in scences
  useEffect(()=>{
    // if layers.lenght of scene is 1, remove it
    if(scences[0].layers.length === 1){
      scences.splice(0, 1)
    }
  },[])
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
    // scences.splice(0, 1)

    // remove all element in upload array
    setUploads([])
  }, [])

  const handleSelectSceneById = (id: string) => {
    const scenceItem = scences.find((scence) => scence.id === id)
    if (scenceItem) {
      setCurrentScene(scenceItem)
    }
  }
  console.log(currentScene, "currentScene")

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
    return (
      <div className="w-full h-screen flex-col flex justify-center items-center text-5xl text-green-800">
        <p>There is no scene to preview</p>
        <div>
          <Link to={"/"}>
            <button className="p-2.5 bg-slate-600 text-white rounded-[16px] mt-3 text-xl font-light px-10">
              Back To Home Page
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full mx-auto   ">
        {loading ? (
          <Loading />
        ) : (
          <>
            <nav className="bg-white dark:bg-gray-900 sticky w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 flex px-2.5 pt-2.5">
              <button
                onClick={goBack}
                className=" h-[45px] rounded-[16px] px-5 bg-white "
              >
                  Back
              </button>
              <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
                <h2 className="font-bold text-black dark:text-white">Preview</h2>
              </div>
            </nav>
            <div className="flex ">
              <div className="bg-slate-100">
                <div id="scrollbar" className="overflow-y-scroll p-5 h-screen w-[150px] flex flex-col gap-4">
                  {scences.map((page, index) => (
                    <img
                      onClick={() => handleSelectSceneById(page.id)}
                      className="w-full cursor-pointer rounded-[16px]"
                      key={index}
                      src={page.preview}
                    />
                  ))}
                </div>
              </div>

              {/* preview item */}
              <div className=" h-screen w-[100vh] mx-auto flex justify-center items-center">
                <div className="w-screen p-5">
                  <img className="w-full" src={currentScene?.preview} alt="current scence" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PreviewALl
