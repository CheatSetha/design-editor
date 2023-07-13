import React, { useCallback, useContext, useEffect, useState } from "react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { Button, SIZE } from "baseui/button"
import DropZone from "~/components/Dropzone"
import { useActiveObject, useEditor, useFrame } from "@layerhub-io/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { captureFrame, loadVideoResource } from "~/utils/video"
import { ILayer } from "@layerhub-io/types"
import { toBase64 } from "~/utils/data"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import useAppContext from "~/hooks/useAppContext"
import { AppContext } from "~/contexts/AppContext"
import loadinggif from "~/assets/loading/loading.gif"
import api from "~/services/api"
import { add } from "lodash"
import useEditorType from "~/hooks/useEditorType"

export default function () {
  const scenes = useDesignEditorScenes()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const inputFileSingleRef = React.useRef<HTMLInputElement>(null)
  const inputFileFolderRef = React.useRef<HTMLInputElement>(null)
  const inputLogoRef = React.useRef<HTMLInputElement>(null)
  const inputTemplateRef = React.useRef<HTMLInputElement>(null)
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { uploads, setUploads } = useContext(AppContext)
  const [isUploading, setIsUploading] = useState(false)
  const { setUploadTemp } = useAppContext()
  const [loading, setLoading] = useState(false)
  const frame = useFrame()
  const editorType = useEditorType()

  const handleDropFiles = async (files: FileList) => {
    setIsUploading(true)
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "image/svg+xml",
      "image/vnd.microsoft.icon",
      "image/x-icon",
      "image/vnd.wap.wbmp",
      "image/avif",
      "image/apng",
      "image/jxr",
      "image/heif",
      "image/heic",
      "image/heif-sequence",
      "image/heic-sequence",
      "image/heif-image-sequence",
      "image/heic-image-sequence",
    ]
    const validFiles: File[] = []
    const invalidFiles: File[] = []

    Array.from(files).forEach((file) => {
      if (imageTypes.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      alert(
        `The following files are not images and will be removed: ${invalidFiles.map((file) => file.name).join(", ")}`
      )
    }

    const formData = new FormData()
    validFiles.forEach((file) => {
      formData.append("files", file)
    })

    try {
      setLoading(true)
      const response = await fetch(`https://photostad-api.istad.co/api/v1/files/upload-folder`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload files")
      }

      const data = await response.json()
      setIsUploading(false)

      setUploadTemp(data.data)
      console.log(data?.data?.url[0], "data uploaded")
      // const base64 = (await toBase64(validFiles[0])) as string;

      let preview = data?.data?.url[0]
      let width = 0
      let height = 0
      const maxWidth = 3000
      const image = new Image()
      const imagePromise = new Promise((resolve) => {
        image.onload = () => {
          width = image.width
          height = image.height
          // @ts-ignore
          resolve()
        }
      })

      image.src = data?.data?.url[0]
      await imagePromise
      const type = "StaticImage"
      const upload = {
        id: nanoid(),
        src: data?.data?.url[0],
        preview: preview,
        type: type,
        width: width,
        height: height,
      }
      console.log(upload, "upload")
      setLoading(false)
      setUploads([...uploads, upload])
      addImageToCanvas2(upload)
      return [upload]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // @ts-ignore
  const uploadMultipleImages = async (files: FileList): Promise<Upload[]> => {
    setIsUploading(true)
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "image/svg+xml",
      "image/vnd.microsoft.icon",
      "image/x-icon",
      "image/vnd.wap.wbmp",
      "image/avif",
      "image/apng",
      "image/jxr",
      "image/heif",
      "image/heic",
      "image/heif-sequence",
      "image/heic-sequence",
      "image/heif-image-sequence",
      "image/heic-image-sequence",
    ]
    const validFiles: File[] = []
    const invalidFiles: File[] = []

    Array.from(files).forEach((file) => {
      if (imageTypes.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      alert(
        `The following files are not images and will be removed: ${invalidFiles.map((file) => file.name).join(", ")}`
      )
    }

    const formData = new FormData()
    validFiles.forEach((file) => {
      formData.append("files", file)
    })

    try {
      setLoading(true)
      const response = await fetch(`https://photostad-api.istad.co/api/v1/files/upload-folder`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload files")
      }

      const data = await response.json()
      setIsUploading(false)

      setUploadTemp(data.data)
      console.log(data?.data?.url[0], "data uploaded")
      // const base64 = (await toBase64(validFiles[0])) as string;

      let preview = data?.data?.url[0]
      let width = 0
      let height = 0
      const maxWidth = 3000
      const image = new Image()
      const imagePromise = new Promise((resolve) => {
        image.onload = () => {
          width = image.width
          height = image.height
          // if(image.width > maxWidth){
          //   const ratio = image.width / image.height
          //   const newWidth = maxWidth
          //   const newHeight = newWidth / ratio
          //   width = newWidth
          //   height = newHeight
          // }else{
          //   width = image.width;
          //   height = image.height;
          // }
          // @ts-ignore
          resolve()
        }
      })

      image.src = data?.data?.url[0]
      await imagePromise
      const type = "StaticImage"
      const upload = {
        id: nanoid(),
        src: data?.data?.url[0],
        preview: preview,
        type: type,
        width: width,
        height: height,
      }
      console.log(upload, "upload")
      setLoading(false)
      setUploads([...uploads, upload])
      addImageToCanvas2(upload)
      return [upload]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addObject = React.useCallback(
    (url: string) => {
      if (editor) {
        const options = {
          type: "StaticImage",
          src: url,
        }
        editor.objects.add(options)
      }
    },
    [editor]
  )

 // for uploading logo
 const handleUploadLogo = async (files: FileList) => {
  const formdata = new FormData()
  formdata.append("file", files[0])
  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };
  try{
    const res = await fetch("https://photostad-api.istad.co/api/v1/files", requestOptions)
    const data = await res.json()
    console.log(data?.data?.url, "data")
    const url = data?.data?.url
    addObject(url)
  }
  catch(error){
    console.log("error", error)
  }
}
// handle upload template
const handleUploadTemplate = async (files: FileList) => {
  const formdata = new FormData()
  formdata.append("file", files[0])
  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };
  try{
    const res = await fetch("https://photostad-api.istad.co/api/v1/files", requestOptions)
    const data = await res.json()
    console.log(data?.data?.url, "data")
    const url = data?.data?.url

    const image = new Image();
    image.src = url;
    let preview = url
    let width = 0
    let height = 0
    const imagePromise = new Promise((resolve) => {
      image.onload = () => {
        width = image.width
        height = image.height
        // if(image.width > maxWidth){
        //   const ratio = image.width / image.height
        //   const newWidth = maxWidth
        //   const newHeight = newWidth / ratio
        //   width = newWidth
        //   height = newHeight
        // }else{
        //   width = image.width;
        //   height = image.height;
        // }
        // @ts-ignore
        resolve()
      }
    })
    await imagePromise
    const type = "StaticImage"
    const upload = {
      id: nanoid(),
      src:preview,
      preview: preview,
      type: type,
      width: width,
      height: height,
    }
    setUploads([...uploads, upload])
    addImageToCanvas2(upload)

  }
  catch(error){
    console.log("error", error)
  }
}

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }
  const handleInputSingleFileRefClick = () => {
    inputTemplateRef.current?.click()
  }
  const handleInputFolderFileRefClick = () => {
    inputFileFolderRef.current?.click()
  }
  const handleInputLogoRefClick = () => {
    inputLogoRef.current?.click()
  }

  const handleInputLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadLogo(e.target.files!)
  }
  const handleInputTemplateFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    handleUploadTemplate(e.target.files!)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!)
  }
  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadMultipleImages(e.target.files!)
  }

  const addImageToCanvas2 = (props: Partial<ILayer>) => {
    editor.objects.add(props)
    editor.frame.resize({
      width: props.width || 0,
      height: props.height || 0,
    })
  }
  //   const addImageToCanvas2 = (props: Partial<ILayer>) => {
  //     const maxWidth = 3000
  //   editor.objects.add(props)
  //     // @ts-ignore
  //   if (props?.width > maxWidth) {
  //     // @ts-ignore
  //     const ratio = props?.width / props?.height
  //     const newWidth = maxWidth
  //     const newHeight = newWidth / ratio
  //     editor.frame.resize({
  //       width: newWidth,
  //       height: newHeight,
  //     })

  //   }else{
  //     editor.frame.resize({
  //       width: props.width || 0,
  //       height: props.height || 0,
  //     })
  //   }

  // }
  const addImageToCanvas = (props: Partial<ILayer>) => {
    editor.objects.add(props)
  }

  React.useEffect(() => {
    const scene = scenes[0].layers.length
    if (uploads.length > 0) {
      if (scene === 1) {
        addImageToCanvas(uploads[0])
      }
    }
  }, [scenes])

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

      console.log(updatedScene, "updatedScene")
      return updatedScene
    })
    console.log("1scence")
    setScenes(updatedScenes)
  }

  const { setScenes, setCurrentScene, currentScene, setCurrentDesign, currentDesign } =
    React.useContext(DesignEditorContext)

  if (isUploading) {
    return (
      <div className="w-full h-screen absolute z-50 flex justify-center items-center bg-white ">
        <img className="w-[400px]" src={loadinggif} alt="loading" />
      </div>
    )
  }

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
              onClick={handleInputFolderFileRefClick}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                    marginTop: "0.5rem",
                  },
                },
              }}
            >
              Upload photos
            </Button>
            {/* upload certificate template */}
            <Button
              onClick={handleInputSingleFileRefClick}
              style={{ display: editorType === "PRESENTATION" ? "block" : "none" }}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                    marginTop: "0.5rem",
                  },
                },
              }}
            >
              Upload Template
            </Button>
            <Button
              // onClick={handleInputSingleFileRefClick}
              onClick={handleInputLogoRefClick}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                    marginTop: "0.5rem",
                  },
                },
              }}
            >
              Add Logo
            </Button>
            <input
              onChange={handleInputLogoFile}
              type="file"
              id="file"
              ref={inputLogoRef}
              style={{ display: "none" }}
              multiple
            />
            <input
            // back soon
              onChange={handleInputTemplateFile}
              type="file"
              id="file"
              ref={inputTemplateRef}
              style={{ display: "none" }}
              multiple
            />

            <input
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              // @ts-ignore
              webkitdirectory="true"
              mozdirectory="true"
              directory="true"
              multiple
            />
            <input
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileSingleRef}
              style={{ display: "none" }}
              multiple
            />
            <input
              onChange={handleFolderInput}
              type="file"
              id="file"
              ref={inputFileFolderRef}
              style={{ display: "none" }}
              mozdirectory="true"
              directory="true"
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
                    <img
                      className="rounded-[10px]"
                      width="100%"
                      src={upload.preview ? upload.preview : upload.url}
                      alt="preview"
                    />
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
