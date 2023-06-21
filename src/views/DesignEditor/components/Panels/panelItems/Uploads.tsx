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
  //add logo
  const addLogo = () => {
    // Handle the case where currentScene is null or undefined
    if (!currentScene) {
      console.log("currentScene is null")
      return
    }
    console.log("currentScene is not null")
    const updatedScenes = scenes.map((scene) => {
      const updatedScene = { ...scene }
      uploads.forEach((upload) => {
        const { src, type } = upload
        const newLayer = {
          id: nanoid(),
          name: "StaticImage",

          left: 275.0000000000001,
          top: 261.34000000000003,
          opacity: 1,
          originX: "left",
          originY: "top",
          scaleX: 0.2,
          scaleY: 0.2,
          type: "StaticImage",
          src: src,
          metadata: {},
        }
        updatedScene.layers.push(newLayer)
      })
      setCurrentScene(updatedScene)
      return updatedScene
    })
    setScenes(updatedScenes)
  }

  const scenes = useDesignEditorScenes()
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
          setCurrentScene(updatedScene)
          images.shift()
        }
      })
      console.log("length image", images.length)

      return updatedScene
    })
    console.log("1scence")
    setScenes(updatedScenes)
  }
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

  React.useEffect(() => {
    // scence index 1
    if (uploads.length > 1 && scenes.length < uploads.length) {
      handleAddNewScene()
    }
  }, [uploads, handleAddNewScene])

  //   safe code

  // create new scene based on number of uploaded images
  // React.useEffect(() => {

  //   console.log(uploads.length, scenes.length, 'length')

  //   // scence index 1

  //   if (uploads.length > 0 && scenes.length <= uploads.length) {

  //     handleAddNewScene()
  //     // add image to scence base on index
  //     const upload = uploads[scenes.length]
  //     console.log(upload,'uploaded image ')
  //     addImageToCanvas(upload)

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
              onClick={dropImages}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                    marginTop: "0.75rem",
                  },
                },
              }}
            >
              Add to all scenes
            </Button>
            <Button
              onClick={addLogo}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                    marginTop: "0.75rem",
                  },
                },
              }}
            >
              addLogo
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
