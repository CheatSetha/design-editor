import { IStaticText } from "@layerhub-io/types"
import { groupBy } from "lodash"
import { SAMPLE_FONTS } from "~/constants/editor"
import { IFontFamily } from "~/interfaces/editor"

export const getTextProperties = (object: Required<IStaticText>, fonts: IFontFamily[]) => {
  const color = object.fill
  const family = object.fontFamily
  // const selectedFont = fonts.find((sampleFont) => sampleFont.postScriptName === family)
  const selectedFont = SAMPLE_FONTS.find((sampleFont) => sampleFont.family === family)
  const groupedFonts = groupBy(SAMPLE_FONTS, "family")
  const selectedFamily = groupedFonts[selectedFont!?.family]

  // const hasBold = selectedFamily.find((font) => font.postScriptName.includes("-Bold"))
  // const hasItalic = selectedFamily.find((font) => font.postScriptName.includes("-Italic"))
  const hasBold = selectedFamily.find((font)=> font.family.includes("-Bold"))
  const hasItalic = selectedFamily.find((font)=> font.family.includes("-Italic"))
  const styleOptions = {
    hasBold: !!hasBold,
    hasItalic: !!hasItalic,
    options: selectedFamily,
  }
  return {
    color,
    family: selectedFamily[0].family,
    bold: family.includes("Bold"),
    italic: family.includes("Italic"),
    underline: object.underline,
    styleOptions,
  }
}
