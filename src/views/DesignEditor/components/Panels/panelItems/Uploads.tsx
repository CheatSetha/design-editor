import React, { useContext, useEffect, useState } from "react"
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


export default function () {
  const scenes = useDesignEditorScenes()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const inputFileSingleRef = React.useRef<HTMLInputElement>(null)
  const inputFileFolderRef = React.useRef<HTMLInputElement>(null)
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { uploads, setUploads } = useContext(AppContext)
  const { setUploadTemp } = useAppContext()
  const [loading, setLoading] = useState(false)
  const frame = useFrame()
  const [desirdedFrame, setDesiredFrame] = useState({
    width: 0,
    height: 0,
  })


  const handleDropFiles = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const isVideo = file.type.includes("video")
      const base64 = (await toBase64(file)) as string
      let preview = base64
      let width = 0
      let height = 0

      if (!isVideo) {
        const image = new Image()
        const imagePromise = new Promise((resolve) => {
          image.onload = () => {
            width = image.width
            height = image.height
            // @ts-ignore
            resolve()
          }
        })
        image.src = base64
        await imagePromise
      } else {
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
        width: width,
        height: height,
      }

      return upload
    })
    const newUploads = await Promise.all(uploadPromises)
    setUploads([...uploads, ...newUploads])
  }


  // test

  // @ts-ignore
  const uploadMultipleImages = async (files: FileList): Promise<Upload[]> => {
    const imageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
      'image/vnd.microsoft.icon',
      'image/x-icon',
      'image/vnd.wap.wbmp',
      'image/avif',
      'image/apng',
      'image/jxr',
      'image/heif',
      'image/heic',
      'image/heif-sequence',
      'image/heic-sequence',
      'image/heif-image-sequence',
      'image/heic-image-sequence',
    ];
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
  
    Array.from(files).forEach((file) => {
      if (imageTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });
  
    if (invalidFiles.length > 0) {
      alert(`The following files are not images and will be removed: ${invalidFiles.map((file) => file.name).join(', ')}`);
    }
  
    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("files", file);
    });
  
    try {
      setLoading(true);
      const response = await fetch(`https://photostad-api.istad.co/api/v1/files/upload-folder`, {
      
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
  
      const data = await response.json();
    

      setUploadTemp(data.data);
      const base64 = (await toBase64(validFiles[0])) as string;
      
      let preview = base64;
      let width = 0;
      let height = 0;
      const image = new Image();
      const imagePromise = new Promise((resolve) => {
        image.onload = () => {
          width = image.width;
          height = image.height;
          // @ts-ignore
          resolve();
        };
      });
      image.src = base64;
      await imagePromise;
      const type = "StaticImage";
      const upload = {
        id: nanoid(),
        src: base64,
        preview: preview,
        type: type,
        width: width,
        height: height,
      };
      console.log(upload, "upload");
      setLoading(false);
      setUploads([...uploads, upload]);
      addImageToCanvas2(upload);
      return [upload];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // const newUploads = await Promise.all(
  //   data.data.url.map(async (filename: string) => {
  //     const image = new Image()
  //     const imagePromise = new Promise((resolve) => {
  //       image.onload = () => {
  //         // @ts-ignore
  //         resolve()
  //       }
  //     })
  //     image.src = filename
  //     await imagePromise
  //     return {
  //       id: nanoid(),
  //       src: filename,
  //       preview: filename,
  //       type: "StaticImage",
  //       width: image.width,
  //       height: image.height,
  //     }
  //   })
  // )

  // setUploads([...uploads, ...newUploads])
  // return newUploads
  //   } catch (error) {
  //     console.error(error)
  //     throw error
  //   }
  // }

  // end of test

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }
  const handleInputSingleFileRefClick = () => {
    inputFileSingleRef.current?.click()
  }
  const handleInputFolderFileRefClick = () => {
    inputFileFolderRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!)
  }
  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {

    uploadMultipleImages(e.target.files!)
  }
  // test upload folder with api

  // const handleUploadFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   handleUploadFolder(e)
  // }

  // original code
  // const addImageToCanvas = (props: Partial<ILayer>) => {
  //   props.preview=""
  //   editor.objects.add(props)
  // }

  // test code it's work but ....
  const addImageToCanvas2 = (props: Partial<ILayer>) => {
    editor.objects.add(props)
    editor.frame.resize({
      width: props.width || 0,
      height: props.height || 0,
    })
  }
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
            {/* <Button
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
              Select a batch of images
            </Button> */}
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
            <Button
              onClick={handleInputSingleFileRefClick}
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
              webkitdirectory="true"
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
