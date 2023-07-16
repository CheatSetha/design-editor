import React, { useContext, useEffect, useState } from "react"
import { styled, ThemeProvider, DarkTheme } from "baseui"
import { Theme } from "baseui/theme"
import { Button, KIND } from "baseui/button"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Play from "~/components/Icons/Play"
import { Block } from "baseui/block"
import { useEditor, useFrame } from "@layerhub-io/react"
import useEditorType from "~/hooks/useEditorType"
import { IScene } from "@layerhub-io/types"
import { loadTemplateFonts } from "~/utils/fonts"
import { loadVideoEditorAssets } from "~/utils/video"
import DesignTitle from "./DesignTitle"
import { IDesign } from "~/interfaces/DesignEditor"
import logo from "~/assets/logos/mainlogov2.png"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { AppContext } from "~/contexts/AppContext"
import { add, template } from "lodash"
import useAppContext from "~/hooks/useAppContext"
import { nanoid } from "nanoid"
import { Link } from "react-router-dom"
import PreviewModal from "./components/PreviewModal"
import PreviewALl from "../Preview/TestPreview"
import loadinggif from "~/assets/loading/loading.gif"
import api from "~/services/api"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  height: "64px",
  background: $theme.colors.black,
  display: "grid",
  padding: "0 1.25rem",
  gridTemplateColumns: "380px 1fr 380px",
  alignItems: "center",
}))
const BASE_URL = "https://photostad-api.istad.co/api/v1/"

const Navbar = () => {
  const { setDisplayPreview, setScenes, setCurrentDesign, currentDesign, scenes } = useDesignEditorContext()
  const editorType = useEditorType()
  const editor = useEditor()
  const { uploadTemp } = useAppContext()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const inputExelRef = React.useRef<HTMLInputElement>(null)
  const scences = useDesignEditorScenes()
  const frame = useFrame()
  const [loading, setLoading] = useState(false)
  const [quality, setQuality] = useState("HIGH")
  const [donwloadType, setDonwloadType] = useState("PDF") //PDF AND ZIP
  const [isePreviewOpen, setIsPreviewOpen] = useState(false)

  const handleOpenPreview = () => {
    setIsPreviewOpen(true)
  }
  const handleClosePreview = () => {
    setIsPreviewOpen(false)
  }


  const handleUpload = async (): Promise<void> => {
    setLoading(true)
    const currentScene = editor.scene.exportToJSON()
    // udpatedScenes is an array of scenes that are updated
    // the current scene is updated with the current scene's layers

    const updatedScenes = scenes.map((scn) => {
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
        qualityPhoto: quality,
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


  const handleExportToExcell = async (): Promise<void> => {
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
        createdBy: 19, // add createdBy property
        // folderName: uploadTemp.folderName, // add folderName property
        // folderName: "6048a5ad-8692-4076-adb4-276a9e3daede", // add folderName property
      }
      const dataFeature = {
        sample: template,
        name: "certificate",

        // createdBy: 135, // add createdBy property
      }
      const reposeInsertFeature = await fetch("https://photostad-api.istad.co/api/v1/features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFeature),
      })

      const resultInsertFeature = await reposeInsertFeature.json()
      console.log(resultInsertFeature?.data?.id, "resultInsertFeature")
      console.log(resultInsertFeature, "resultInsertFeature");
      let idFeature = resultInsertFeature?.data?.id
      localStorage.setItem("idFeature", idFeature.toString()) //set idFeature to localstorage

      console.log(idFeature, "idFeature")

      const response = await fetch("https://photostad-api.istad.co/api/v1/certificates/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      setLoading(false)
      console.log(result, "result when export to excell")
      // if success, redirect to download url
      if (result.code === 200) {
        window.location.href = result.data.downloadUrl
      }
    } else {
      console.log("NO CURRENT DESIGN")
    }
  }


  const parseGraphicJSON = () => {
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
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }
      makeDownload(graphicTemplate)

      // makeDownloadCertificate(graphicTemplate)
    } else {
      console.log("NO CURRENT DESIGN")
    }
    setLoading(false)
  }


  const parsePresentationJSON = () => {
    setLoading(true)
    const currentScene = editor.scene.exportToJSON()
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          duration: 5000,
          layers: currentScene.layers,
          name: currentScene.name,
        }
      }
      return {
        id: scn.id,
        duration: 5000,
        layers: scn.layers,
        name: scn.name,
      }
    })

    if (currentDesign) {
      const presentationTemplate: IDesign = {
        id: currentDesign.id,
        type: "PRESENTATION",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }
      // makeDownload(presentationTemplate)

      makeDownloadCertificate(presentationTemplate)
    } else {
      console.log("NO CURRENT DESIGN")
    }
    setLoading(false)
  }
  const makeDownload = (data: Object) => {
    
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
    const a = document.createElement("a")
    a.href = dataStr
    a.download = "template.json"
    a.click()

  }


  const handleDownloadCertificate = async () => {
    setLoading(true)

    const currentScene = editor.scene.exportToJSON()
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          duration: 5000,
          layers: currentScene.layers,
          name: currentScene.name,
        }
      }
      return {
        id: scn.id,
        duration: 5000,
        layers: scn.layers,
        name: scn.name,
      }
    })
    if(currentScene){
      const presentationTemplate: IDesign = {
        id: currentDesign.id,
        type: "PRESENTATION",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }

      const raw = JSON.stringify({
        editorJson: presentationTemplate,
        qualityPhoto: "HIGH",
        createdBy: 31, // add createdBy property
      })
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      }
      try{
        const res = await fetch(`${BASE_URL}certificates/generate-certificate/${donwloadType}`, requestOptions)
        const result = await res.json()
        const url = result?.data?.downloadUrl
        setTimeout(()=>{
          setLoading(false)
        },2000)
        // route donwlod url if success
        if (result.code === 200) {
          window.location.href = url
        }
  
      }
      catch(error){
        console.log(error)
      }
    }else{
      console.log("NO CURRENT DESIGN")
    }

 
  }

  const makeDownloadCertificate = async (data: Object) => {
    
    const raw = JSON.stringify({
      editorJson: data,
      qualityPhoto: "HIGH",
      createdBy: 31, // add createdBy property
    })
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    }

    try {
      // @ts-ignore
      const res = await fetch(
        `https://photostad-api.istad.co/api/v1/certificates/generate-certificate/${donwloadType}`,
        requestOptions
      )
      const result = await res.json()
      const url = result?.data?.downloadUrl
      setLoading(false)
      const downloadLink = document.createElement("a")
      // @ts-ignore
      downloadLink.href = url
      downloadLink.download = "MyCertificate"
      downloadLink.click()
    } catch (error) {
      console.log(error)
    }
  }

// for donwload certificate
  const makeDownloadTemplate = async () => {
    if (editor) {
     
      if (editorType === "GRAPHIC") {
        return parseGraphicJSON()
      } else if (editorType === "PRESENTATION") {
        return parsePresentationJSON()
      }
    }
  }

  const { uploads, setUploads } = useContext(AppContext)

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

  const loadGraphicTemplate = async (payload: IDesign) => {
    const scenes = []
    const { scenes: scns, ...design } = payload

    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn.id,
        layers: scn.layers,
        metadata: {},
      }
      const loadedScene = await loadVideoEditorAssets(scene)
      await loadTemplateFonts(loadedScene)

      const preview = (await editor.renderer.render(loadedScene)) as string
      scenes.push({ ...loadedScene, preview })
    }

    return { scenes, design }
  }

  const loadPresentationTemplate = async (payload: IDesign) => {

    const scenes = []
    const { scenes: scns, ...design } = payload

    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn,
        layers: scn.layers,
        metadata: {},
      }
      const loadedScene = await loadVideoEditorAssets(scene)

      const preview = (await editor.renderer.render(loadedScene)) as string
      await loadTemplateFonts(loadedScene)
      scenes.push({ ...loadedScene, preview })
   
    }
    return { scenes, design }
  }

  const handleImportTemplate = React.useCallback(

    async (data: any) => {
      let template
      if (data.type === "GRAPHIC") {
        template = await loadGraphicTemplate(data)
      } else if (data.type === "PRESENTATION") {
        template = await loadPresentationTemplate(data)
      }
      //   @ts-ignore
      setScenes(template.scenes)
      //   @ts-ignore
      setCurrentDesign(template.design)
    },
    [editor]
  )

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }
  const handleInputExelRefClick = () => {
    inputExelRef.current?.click()
  }

  const handleExcelInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const files = event.target.files
    const id = localStorage.getItem("idFeature")
    if (!files) {
      return
    }

    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        formData.append("fileImage", file)
      } else if (
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/csv"
      ) {
        formData.append("fileExcel", file)
      }
    }

    const response = await fetch(`https://photostad-api.istad.co/api/v1/certificates/${id}/import-excel`, {
      method: "POST",
      body: formData,
    })

    const result = await response.json()
    const design = result?.data
    // generate each scence to scences in editor
   
    handleImportTemplate(design)
    setLoading(false)
    console.log(result?.data, "result.data")
    console.log(design, "design")
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (res) => {
        const result = res.target!.result as string
        const design = JSON.parse(result)
        // console.log(result, "result");
        // console.log(design, "design");
        handleImportTemplate(design)
      }
      reader.onerror = (err) => {
        console.log(err)
      }
      reader.readAsText(file)
    }
  }

  // select type or formart
  const hanleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value, "e.target.value")
    alert(e.target.value)
    setQuality(e.target.value)
  }

  const hanldeSelectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value, "e.target.value")
    setDonwloadType(e.target.value)
  }



  return (
    // @ts-ignore
    <ThemeProvider theme={DarkTheme}>
      <Container className="z-50">
        <img src={logo} alt="logo" style={{ width: "100px" }} />

        <DesignTitle />
        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <input
            multiple={true}
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          {/* for upload excell and list of image at the same time */}
          <input
            multiple={true}
            onChange={handleExcelInput}
            type="file"
            id="file"
            ref={inputExelRef}
            style={{ display: "none" }}
          />
          <Button
            style={{ display: editorType === "PRESENTATION" ? "none" : "block" }}
            size="compact"
            onClick={handleInputFileRefClick}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Import
          </Button>
          <Button
            className="whitespace-nowrap"
            style={{ display: editorType === "PRESENTATION" ? "block" : "none" }}
            size="compact"
            onClick={handleInputExelRefClick}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Import excel
          </Button>

          <Button
            style={{ display: editorType === "PRESENTATION" ? "none" : "block" }}
            size="compact"
            onClick={makeDownloadTemplate}
            // onClick={handleExportToExcell}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Export
          </Button>

          <Button
            style={{ display: editorType === "PRESENTATION" ? "block" : "none" }}
            size="compact"
            // onClick={makeDownloadTemplate}
            onClick={handleExportToExcell}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Export
          </Button>
          {/* dowload template watermark */}
          {/* <Button
            size="compact"
            onClick={handleUpload}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
            style={{ display: editorType === "PRESENTATION" ? "none" : "block" }}
          >
            Download
          </Button> */}
          <div className={`${isePreviewOpen ? " " : "hidden"} absolute top-0 right-0 w-screen h-screen bg-white z-50`}>
 
            <PreviewALl  close={handleClosePreview} />
          </div>
          <div>
            <label className="text-white text-[14px] cursor-pointer p-3 hover:bg-[#333333] rounded-lg py-2.5" htmlFor="modal-2">
              Download
            </label>

            <input className="modal-state" id="modal-2" type="checkbox" />
            <div className="modal w-screen">
              <label className="modal-overlay" htmlFor="modal-2"></label>
              <div className="modal-content flex flex-col bg-white gap-5 max-w-sm">
                <label htmlFor="modal-2" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </label>
                <div className="space-y-2">
                  <h2 className="text-xl my-2 text-center">Download Setting</h2>
                  {editorType === "GRAPHIC" ? (
                    <>
                      <p className="text-sm mt-2">Quality</p>
                      <select value={quality} onChange={hanleSelectChange} className="select w-full">
                        <option className="text-[14px]" disabled>
                          Select Quality
                        </option>
                        <option className="text-[14px]" value={"SMALL"}>
                          small
                        </option>
                        <option className="text-[14px]" value={"MEDIUM"}>
                          medium
                        </option>
                        <option className="text-[14px]" value={"HIGH"}>
                          high
                        </option>
                      </select>
                      <div className="space-y-2 w-full">
                        <label
                          htmlFor="modal-2"
                          onClick={handleOpenPreview}
                          className="btn btn-outline-primary border-black w-full hover:bg-black text-black hover:text-white"
                        >
                          Preview
                        </label>
                        <label onClick={handleUpload} className="btn bg-black text-white btn-block" htmlFor="modal-2">
                          Donwload
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm mt-2">Format</p>
                      <select id="select-type" value={donwloadType} onChange={hanldeSelectTypeChange} className="select w-full ">
                        <option className="text-[14px] w-full" disabled>
                          Select Format
                        </option>
                        <option className="text-[14px] w-full" value={"PDF"}>
                          PDF
                        </option>
                        <option className="text-[14px] w-full" value={"ZIP"}>
                          ZIP
                        </option>
                      </select>

                      <label
                        onClick={() => setDisplayPreview(true)}
                        className="btn btn-outline-primary border-black w-full hover:bg-black text-black hover:text-white"
                        htmlFor="modal-2"
                      >
                        Preview
                      </label>
                      <label
                        // onClick={makeDownloadTemplate}
                        onClick={handleDownloadCertificate}
                        className="btn bg-black text-white w-full "
                        htmlFor="modal-2"
                      >
                        Donwload
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* end of modal */}
          {/* dowload template certificate*/}
          {/* <Button
            size="compact"
            onClick={makeDownloadTemplate}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
            style={{ display: editorType === "GRAPHIC" ? "none" : "block" }}
          >
            Download
          </Button> */}
          <button
          className="py-2.5 p-3 rounded-lg btn hover:bg-[#333333] text-white"
            onClick={() => setDisplayPreview(true)}
           
          >
            <Play size={24}  /> preview
          </button>
        </Block>
      </Container>
      {/* {loading && <div className="loader"></div>} */}
      {loading && (
         <div className="w-full h-screen absolute z-30 flex  items-center bg-white  left-[85px] ">
         <img className="w-[400px] mx-auto  " src={loadinggif} alt="loading" />
       </div>
      )}
    </ThemeProvider>
  )
}

export default Navbar
