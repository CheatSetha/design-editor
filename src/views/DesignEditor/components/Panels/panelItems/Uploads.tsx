import React, { useContext, useEffect, useState } from "react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { Button, SIZE } from "baseui/button"
import DropZone from "~/components/Dropzone"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { captureFrame, loadVideoResource } from "~/utils/video"
import { ILayer } from "@layerhub-io/types"
import { toBase64} from "~/utils/data"
import { getDefaultTemplate } from "~/constants/design-editor"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { useDispatch } from "react-redux"
import { addUploads } from "~/store/slices/uploadImage/uploadImageSlice"
import { current } from "@reduxjs/toolkit"
import useAppContext from "~/hooks/useAppContext"
import { AppContext } from "~/contexts/AppContext"


// export default function () {
//   const inputFileRef = React.useRef<HTMLInputElement>(null)
//   const [uploads, setUploads] = React.useState<any[]>([])
//   const editor = useEditor()
//   const setIsSidebarOpen = useSetIsSidebarOpen()

//   const handleDropFiles = async (files: FileList) => {
//     const file = files[0]

//     const isVideo = file.type.includes("video")
//     const base64 = (await toBase64(file)) as string
//     let preview = base64
//     if (isVideo) {
//       const video = await loadVideoResource(base64)
//       const frame = await captureFrame(video)
//       preview = frame
//     }

//     const type = isVideo ? "StaticVideo" : "StaticImage"

//     const upload = {
//       id: nanoid(),
//       src: base64,
//       preview: preview,
//       type: type,
//     }

//     setUploads([...uploads, upload])
//   }

//   const handleInputFileRefClick = () => {
//     inputFileRef.current?.click()
//   }

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     handleDropFiles(e.target.files!)
//   }

//   const addImageToCanvas = (props: Partial<ILayer>) => {
//     editor.objects.add(props)
//   }
//   return (
//     <DropZone handleDropFiles={handleDropFiles}>
//       <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Block
//           $style={{
//             display: "flex",
//             alignItems: "center",
//             fontWeight: 500,
//             justifyContent: "space-between",
//             padding: "1.5rem",
//           }}
//         >
//           <Block>Uploads</Block>

//           <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
//             <AngleDoubleLeft size={18} />
//           </Block>
//         </Block>
//         <Scrollable>
//           <Block padding={"0 1.5rem"}>
//             <Button
//               onClick={handleInputFileRefClick}
//               size={SIZE.compact}
//               overrides={{
//                 Root: {
//                   style: {
//                     width: "100%",
//                   },
//                 },
//               }}
//             >
//               Computer
//             </Button>
//             <input multiple onChange={handleFileInput} type="file" id="file" ref={inputFileRef} style={{ display: "none" }} />

//             <div
//               style={{
//                 marginTop: "1rem",
//                 display: "grid",
//                 gap: "0.5rem",
//                 gridTemplateColumns: "1fr 1fr",
//               }}
//             >
//               {uploads.map((upload) => (
//                 <div
//                   key={upload.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => addImageToCanvas(upload)}
//                 >
//                   <div>
//                     <img width="100%" src={upload.preview ? upload.preview : upload.url} alt="preview" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Block>
//         </Scrollable>
//       </Block>
//     </DropZone>
//   )
// }
export default function () {
  const scenes = useDesignEditorScenes()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const { uploads, setUploads } = useContext(AppContext)



  // const fileToBlob = (file: File): Promise<Blob> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.readAsArrayBuffer(file)
  //     reader.onload = () => {
  //       const blob = new Blob([reader.result as ArrayBuffer], { type: file.type })
  //       resolve(blob)
  //     }
  //     reader.onerror = () => {
  //       reject(new Error("Failed to convert file to blob"))
  //     }
  //   })
  // }


  const handleDropFiles = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const isVideo = file.type.includes("video")
      const base64 = (await toBase64(file)) as string
   
      console.log("blob", base64)
      
      let preview = base64
     
      if (isVideo) {
        const video = await loadVideoResource(base64)
        const frame = await captureFrame(video)
        preview = frame
      }

      const type = isVideo ? "StaticVideo" : "StaticImage"

      const upload = {
        id: nanoid(),
        src: base64,
        preview: preview,
        type: type,
      }

      return upload
    })
    const newUploads = await Promise.all(uploadPromises)
    setUploads([...uploads, ...newUploads])
  }
  console.log("upload blob",uploads)







  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }


  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!)
    
  }



  const addImageToCanvas = (props: Partial<ILayer>) => {
    editor.objects.add(props)
  }
  // ------------------| test code here |------------------//
  const applyAll = async () => {
    console.log("all scenes", scenes)

    for (let i = 0; i < uploads.length; i++) {
      const { src, id } = uploads[i]
      // Clone the object of scenes[0]
      const image = JSON.parse(JSON.stringify(scenes[0]))
      console.log("image in scene", image)

      // Push the modified image object to scenes array
      image.id = id
      image.layers[1].preview = src
      image.layers[1].src = src
      image.layers[1].id = id
      image.preview = ""
      console.log("image in scene already push", image)
      // setScenes(image);
      scenes.push(image)
      console.log("all scenes", scenes)
    }
  }
  
  

  const dropImages = async () => {
    if (!currentScene) {
      console.log("currentScene is null")
      return // Handle the case where currentScene is null or undefined
    }
    console.log("currentScene is not null")
    const updatedScenes = scenes.map((scene) => {
      const updatedScene = { ...scene }

      let images = uploads
      images.forEach((image) => {
        const { src, type } = image
        const newLayer = {
          id: nanoid(),
          name: "StaticImage",
          opacity: 1,
          type: "StaticImage",
          scaleX: 1,
          scaleY: 1,
          src: src,
          metadata: {},
        }

        if (updatedScene.layers.length < 2) {
          updatedScene.layers.push(newLayer)
          const updatedTemplate = editor.scene.exportToJSON()
          const updatedPreview = editor.renderer.render(updatedTemplate)
          // @ts-ignore
          updatedScene.preview = updatedPreview
          setCurrentScene(updatedScene)
          console.log("updated preview", updatedPreview)
          images.shift()
        }
      })
      console.log("length image", images.length)

      console.log(updatedScene, "updatedScene")
      return updatedScene
    })
    console.log("1scence")
    setScenes(updatedScenes)
  }
  const { setScenes, setCurrentScene, currentScene, setCurrentDesign, currentDesign } =
    React.useContext(DesignEditorContext)

  const [currentPreview, setCurrentPreview] = React.useState("")
 

  return (
    <DropZone handleDropFiles={handleDropFiles}>
      <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Block
          $style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            justifyContent: "space-between",
            padding: "1.5rem",
          }}
        >
          <Block>Uploads</Block>

          <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Scrollable>
          <Block padding={"0 1.5rem"}>
            <Button
              onClick={handleInputFileRefClick}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              Select Folder
            </Button>
      

           

            <input
            // @ts-ignore
              webkitdirectory="true"
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              multiple
            />
          

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => addImageToCanvas(upload)}
                >
                  <div>
                    <img className="rounded-[10px]" width="100%" src={upload.preview ? upload.preview : upload.url} alt="preview" />
                  </div>
                </div>
              ))}
            </div>
          </Block>
        </Scrollable>
      </Block>
    </DropZone>
  )
}
