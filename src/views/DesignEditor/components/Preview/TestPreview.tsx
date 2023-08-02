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
import { resolve } from "path"
import { compressBase64ToBlobURL } from "~/utils/data"

interface props {
  close: () => void
}

const PreviewALl = ({ close }: props) => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const { uploadTemp, blobList } = useAppContext()
  const listOfurl = uploadTemp?.url
  // console.log(listOfurl, "listOfurl")

  //+++++++++++++++ test code ++++++++++++++++++++++++//
  const scences = useDesignEditorScenes()
  const { currentScene, setCurrentScene } = useContext(DesignEditorContext)
  const { uploads, setUploads } = useContext(AppContext)

  const [state, setState] = React.useState({ image: "" })
  // console.log(state, "state")

  const [currentIndex, setCurrentIndex] = useState(0)

  let template2: any

  const makePreview2 = async (currentIndex: number) => {
    setCurrentIndex(currentIndex)
    template2 = editor.scene.exportToJSON()
    // console.log(template2, "template2")
    const oldPreview = template2.layers[1]?.preview
    const newPreview = listOfurl[currentIndex]
    // const newPreview = blobList[currentIndex]
    //replace oldPreview with another image
    template2.layers[1].preview = newPreview
    template2.layers[1].src = newPreview
    // console.log(template2.layers[1].preview, "setha")

    // image return as base64
    const image = (await editor.renderer.render(template2)) as string
    setState({ image })
  }

  useEffect(() => {
    makePreview2(currentIndex)
  }, [currentIndex])

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
        
        </nav>
        <div className="flex ">
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

          {/* preview item */}
          <div className=" h-screen w-screen mx-auto flex justify-center items-center">
            <div className=" p-5">
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
