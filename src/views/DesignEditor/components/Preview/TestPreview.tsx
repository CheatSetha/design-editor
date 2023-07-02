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
import useAppContext from "~/hooks/useAppContext"
import { Canvas as LayerhubCanvas } from "@layerhub-io/react"

const PreviewALl = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()
  const { uploadTemp } = useAppContext()
  console.log(uploadTemp.url, "uploadTemp")
  const listOfurl = uploadTemp.url
  const goBack = () => {
    navigate(-1)
  }

  //+++++++++++++++ test code ++++++++++++++++++++++++//
  const scences = useDesignEditorScenes()
  const { currentScene, setCurrentScene } = useContext(DesignEditorContext)
  const { uploads, setUploads } = useContext(AppContext)
  console.log(scences, scences.length, "scences")

  const [images, setImages] = useState<{ id: string; preview: string }[]>([])
  const [state, setState] = React.useState({
    image: "",
  })

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
  let template
  const makePreview = React.useCallback(async () => {
    if (editor) {
      template = editor.scene.exportToJSON()
      // preview only scene [0]

      // console.log(template, "template")

      const image = (await editor.renderer.render(template)) as string

      setState({ image })
      setLoading(false)
    }
  }, [editor])

  React.useEffect(() => {
    makePreview()
  }, [editor])

  //handle slice first element in scences
  useEffect(() => {
    // if layers.lenght of scene is 1, remove it
    if (scences[0].layers.length === 1) {
      scences.splice(0, 1)
    }
  }, [])

  const addScene = React.useCallback(async () => {
    for (let i = 0; i < uploads.length; i++) {
      const { src, id, width, height } = uploads[i]
      const template = editor.scene.exportToJSON()
      const previewImg = JSON.parse(JSON.stringify(template))
      console.log(template, "template")
      console.log("previewImg", previewImg)

      // const layers = previewImg.layers[2];
      // const left = layers.left;
      // const top = layers.top;
      // const frameWidth = previewImg.frame.width;
      // const frameHeight = previewImg.frame.height;
      // const leftPercentage = (left / frameWidth) * 100;
      // const topPercentage = (top / frameHeight) * 100;
      // console.log("leftPercentage", leftPercentage);
      // console.log("topPercentage", topPercentage);

      // Push the modified image object to scenes array
      previewImg.id = id
      previewImg.layers[1].preview = src
      previewImg.layers[1].src = src
      previewImg.layers[1].id = id
      previewImg.layers[1].left = 0
      previewImg.layers[1].top = 0
      previewImg.preview = ""

      // previewImg.frame.width = width    //set frame based on image width
      // previewImg.frame.height = height
      // previewImg.layers[2].left = leftPercentage+'%'   //set frame based on image width
      // previewImg.layers[2].top = topPercentage+'%'

      //set frame based on image height
      // config layer [1]
      // calculate top and left as percentage and apply to all layers after layer[2]

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
  console.log(editor, "editor");

 

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
                className=" px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700  rounded-[16px] dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Back
              </button>
              <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
                <h2 className="font-bold text-black dark:text-white">Preview</h2>
              </div>
              <button
                onClick={goBack}
                className=" px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700  rounded-[16px] dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Download
              </button>
            </nav>
            <div className="flex ">
              <div className="bg-slate-100">
                <div id="scrollbar" className="overflow-y-scroll p-5 h-screen w-[150px] flex flex-col gap-4">
                  {/* old version loop scene */}
                  {/* {scences.map((page, index) => (
                    <img
                      onClick={() => handleSelectSceneById(page.id)}
                      className="w-full cursor-pointer rounded-[16px]"
                      key={index}
                      src={page.preview}
                    />
                  ))} */}

                  {/* try new version  */}
                  {listOfurl.map((url, i) => (
                    <img
                      onClick={() => handleSelectSceneById(i)}
                      className="w-full cursor-pointer rounded-[16px]"
                      key={i}
                      src={url}
                    />
                  ))}
                </div>
              </div>

              {/* preview item */}
              <div className=" h-screen w-[100vh] mx-auto flex justify-center items-center">
                <div className="w-screen p-5">
                  {/* old version */}
                  {/* <img className="w-[600px]" src={currentScene?.preview} alt="current scence" /> */}
                  {!loading && <img className="w-auto h-[600px] " src={state.image} />}
                 
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
