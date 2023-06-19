import React, { useEffect, useState } from "react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { Button, SIZE } from "baseui/button"
import DropZone from "~/components/Dropzone"
import { useEditor } from "@layerhub-io/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { captureFrame, loadVideoResource } from "~/utils/video"
import { ILayer } from "@layerhub-io/types"
import { toBase64 } from "~/utils/data"
import { getDefaultTemplate } from "~/constants/design-editor"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { add } from "@dnd-kit/utilities"



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
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = React.useState<any[]>([])
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()


  console.log("uploads", uploads)
  const handleDropFiles = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const isVideo = file.type.includes("video")
      const base64 = (await toBase64(file)) as string
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
const scenes = useDesignEditorScenes()
  const { setScenes, setCurrentScene, currentScene, setCurrentDesign, currentDesign } =
    React.useContext(DesignEditorContext)

  const [currentPreview, setCurrentPreview] = React.useState("")
//handle create new scene when upload new image
  const handleAddNewScene = React.useCallback(async () => {
    setCurrentPreview("")
    const updatedTemplate = editor.scene.exportToJSON()
    const updatedPreview = await editor.renderer.render(updatedTemplate)

    const updatedPages = scenes.map((p) => {
      if (p.id === updatedTemplate.id) {
        return { ...updatedTemplate, preview: updatedPreview }
      }
      return p
    })

    const defaultTemplate = getDefaultTemplate(currentDesign.frame)
    const newPreview = await editor.renderer.render(defaultTemplate)
    const newPage = { ...defaultTemplate, id: nanoid(), preview: newPreview } as any
    const newPages = [...updatedPages, newPage] as any[]
    setScenes(newPages)
    setCurrentScene(newPage)

  }, [scenes, currentDesign])




useEffect(() => {
  if(uploads.length > 0 && scenes.length <= uploads.length-1){
    handleAddNewScene()
  
  }
  uploads.forEach((upload, index) => {
    const scene = scenes[index]
    const uploadImg = uploads[index]
 // if uploaded image's index equal to scene's index then add image to scene
   //find the index of uploaded image in scenes
    if (uploadImg.id === scene.id) {
      // add image to scene
      addImageToCanvas(uploadImg)
    }
  })
}, [uploads, scenes, handleAddNewScene])


//   safe code

// create new scene based on number of uploaded images
  // React.useEffect(() => {

  //   console.log(uploads.length, scenes.length, 'length')


  //   // scence index 1



  //   if (uploads.length > 0 && scenes.length <= uploads.length) {
  //     handleAddImageToScene()
  //     handleAddNewScene()
  //     // add image to scence base on index
  //     // const upload = uploads[scenes.length]
  //     // console.log(upload,'uploaded image ')
  //     // addImageToCanvas(upload)

  //   //   add image to each scene one image per scene





  //   }
  // }, [uploads, handleAddNewScene])







  // ------------------| test code here |------------------//







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
              Computer
            </Button>
            <Button
  
         
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              Add to all scenes
            </Button>
            
            <input
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
                    <img width="100%" src={upload.preview ? upload.preview : upload.url} alt="preview" />
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
