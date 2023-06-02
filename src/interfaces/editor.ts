type FontVariant = "300" | "regular" | "400" | "500" | "600" | "700" | "800"

type FontFile = Record<FontVariant, string>

export interface Resource {
  id: string
  preview: string
  src: string
  object: string
}
// IFontFamily is an interface that defines the properties of a font family
export interface IFontFamily {
  id: string
  fullName: string
  family: string
  style: string
  url: string
  postScriptName: string
  preview: string
  category: string
}
// TextOptions is an interface that defines the properties of a text object
// it's use for 

export interface TextOptions {
  underline: boolean
  textAlign: string
  fontSize: number
  fill: string
  charSpacing: number
  lineHeight: number
  fontFamily: string
  isGroup: boolean
  isMultiple: boolean
  styles: any[]
  font: any
  activeStyle: any
}


export interface Uploading {
  status: string
  progress: number
}
// IUpload is an interface that defines the properties of an upload
// 
export interface IUpload {
  id: string
  contentType: string
  folder: string
  name: string
  type: string
  url: string
}
