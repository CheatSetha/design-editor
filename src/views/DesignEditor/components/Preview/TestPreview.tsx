import React, { useCallback, useContext, useEffect, useState } from "react"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { useEditor, useFrame } from "@layerhub-io/react"
import Loading from "~/components/Loading"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { AppContext } from "~/contexts/AppContext"
import { Link, useNavigate } from "react-router-dom"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import useAppContext from "~/hooks/useAppContext"
import { set } from "lodash"
import { IDesign } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

interface props {
  close: () => void
}

const PreviewALl = ({close}:props) => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const { uploadTemp } = useAppContext()
  const listOfurl = uploadTemp?.url

 


  //+++++++++++++++ test code ++++++++++++++++++++++++//
  const scences = useDesignEditorScenes()
  const { currentScene, setCurrentScene } = useContext(DesignEditorContext)
  const { uploads, setUploads } = useContext(AppContext)

  const [state, setState] = React.useState({ image: "" })
  console.log(state, "state")
  // const makePreview = React.useCallback(async () => {
  //   if (editor) {
  //     template = editor.scene.exportToJSON()
  //     const image = (await editor.renderer.render(template)) as string
  //     setState({ image })
  //     setLoading(false)
  //   }
  // }, [editor])

  // React.useEffect(() => {
  //   makePreview()
  // }, [editor])

  // const testPreviewsv2 = useCallback(async()=>{
  //   for(let i = 0; i< listOfurl.length;i++){
  //     // const {src,id,width,height} = listOfurl[i]
  //     const template = editor.scene.exportToJSON()
  //     const previewImg = JSON.parse(JSON.stringify(template))
  //     console.log("preview image ",previewImg)
  //     previewImg.id = i
  //     previewImg.layers[1].preview = listOfurl[i]
  //     previewImg.layers[1].src = listOfurl[i]
  //     previewImg.layers[1].id = i
  //     previewImg.layers[1].left = 0
  //     previewImg.layers[1].top = 0
  //     previewImg.preview = ""
  //     scences.push(previewImg)
  //     console.log("all scenes v2 ", scences)
  //     console.log(previewImg,"previewImg")

  //   }

  // },[])

  // useEffect(()=>{
  //   if(scences.length <= listOfurl.length){
  //     testPreviewsv2()
  //   }
  // },[])
   // handle template upload to server
   const handleUpload = async (): Promise<void> => {
    setLoading(true)
    const currentScene = editor.scene.exportToJSON()
    // udpatedScenes is an array of scenes that are updated
    // the current scene is updated with the current scene's layers

    const updatedScenes = scenes.map((scn) => {
      console.log(scn, "scn")
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        }
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      }
    })

    if (currentDesign) {
      const graphicTemplate: IDesign = {
        id: currentDesign.id,
        type: "GRAPHIC",
        name: currentDesign.name,
        frame: frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }

      let template = graphicTemplate
      const data = {
        editorJson: template,
        qualityPhoto: "HIGH",
        createdBy: 32, // add createdBy property
        folderName: uploadTemp.folderName, // add folderName property
        // folderName: "6048a5ad-8692-4076-adb4-276a9e3daede", // add folderName property
      }
      const response = await fetch("https://photostad-api.istad.co/api/v1/watermarks/generate-watermark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      setLoading(false)
      console.log(result, "result")
      // if success, redirect to download url
      if (result.code === 200) {
        window.location.href = result.data.downloadUrl
      }
    } else {
      console.log("NO CURRENT DESIGN")
    }
  }

  const addScene = React.useCallback(async () => {
    for (let i = 0; i < uploads.length; i++) {
      const { src, id, width, height } = uploads[i]
      const template = editor.scene.exportToJSON()
      const previewImg = JSON.parse(JSON.stringify(template))
      console.log(template, "template")
      console.log("previewImg", previewImg)

      previewImg.id = id
      previewImg.layers[1].preview = src
      previewImg.layers[1].src = src
      previewImg.layers[1].id = id
      previewImg.layers[1].left = 0
      previewImg.layers[1].top = 0
      previewImg.preview = ""

      scences.push(previewImg)
      console.log("all scenes ", scences)
    }
    // scences.splice(0, 1)

    // remove all element in upload array
    setUploads([])
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)

  let template2: any
  const makePreview2 = async (currentIndex: number) => {
    setCurrentIndex(currentIndex)
    template2 = editor.scene.exportToJSON()
    const oldPreview = template2.layers[1]?.preview
    const newPreview = listOfurl[currentIndex]
    //replace oldPreview with another image
    template2.layers[1].preview = newPreview
    template2.layers[1].src = newPreview
    console.log(template2, "template in preview")
    // the problem is here
    const image = (await editor.renderer.render(template2)) as string
    setState({ image })
  }

  useEffect(()=>{
      makePreview2(0)
  },[])

  if (listOfurl === undefined) {
    return (
      <div className="w-full h-screen flex-col flex justify-center items-center text-5xl text-green-800">
        <p>There is no Image To Preview</p>
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
  const { setDisplayPreview, setScenes, setCurrentDesign, currentDesign, scenes } = useDesignEditorContext()
  const frame = useFrame()
  return (
    <>
      <div className="w-full mx-auto z-50  ">
        <nav className="bg-black dark:bg-gray-900 sticky w-full  top-0 left-0 z-50 border-b border-gray-200 dark:border-gray-600 flex px-2.5 pt-2.5">
          <button
            onClick={close}
            className=" px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700  rounded-[16px] dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Close
          </button>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
            <h2 className="font-bold text-white dark:text-white">Preview</h2>
          </div>
          <button
            onClick={handleUpload}
            className=" px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700  rounded-[16px] dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Download
          </button>
        </nav>
        <div className="flex ">
          <div className="bg-slate-100">
            <div id="scrollbar" className="overflow-y-scroll  p-5 h-screen w-[150px] flex flex-col gap-4">
              {listOfurl.map((url: string, i: number) => (
                <>
                <img  className={`${i === currentIndex? 'block':'hidden'} w-5 h-5 z-50 -mb-[50px] ml-[75px]`} src="https://cdn-icons-png.flaticon.com/512/992/992481.png" alt="" />
        
                 <img
                 onClick={() => makePreview2(i)}
                 className={`w-full  cursor-pointer rounded-[16px] ${
                   i === currentIndex ? "border-2 mt-3 border-blue-500" : ""
                 } ${i === listOfurl.length - 1 ? "mb-16" : ""}`}
                 key={i}
                 src={url}
               />
               </>
              ))}
            </div>
          </div>

          {/* preview item */}
          <div className=" h-screen w-[100vh] mx-auto flex justify-center items-center">
            <div className="w-screen p-5">
              <img
                className={`w-auto h-[600px] object-contain image-transition ${
                  state?.image ? "image-fade-in" : "image-fade-out"
                }`}
                src={state?.image}
                alt="Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreviewALl
