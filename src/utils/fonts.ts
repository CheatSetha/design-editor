import { FontItem } from "~/interfaces/common"
import { IScene, ILayer, IStaticText } from "@layerhub-io/types"


/* getFontsFromObjects is a recursive function that returns an array of fonts from a design
 it takes an array of objects and returns an array of fonts*/
/**
 *  getFontsFromObjects is a recursive function that returns an array of fonts from a design. it takes an array of objects and returns an array of fonts
 * Partial<ILayer>[] is an array of objects that are of type ILayer but not all properties are required
 * 
 * @param objects  
 * @returns 
 */
const getFontsFromObjects = (objects: Partial<ILayer>[]) => {
  let fonts: any[] = []
  for (const object of objects) {
    // If the type is "StaticText" or "DynamicText", it pushes an object with the font's name and url to the fonts array.
    if (object.type === "StaticText" || object.type === "DynamicText") {
      fonts.push({
        name: (object as Required<IStaticText>).fontFamily,
        url: (object as Required<IStaticText>).fontURL,
      })
    }
    // If the type is "Group", it calls the function again with the objects property of the group.
    /**
     * If the type is "Group", it recursively calls getFontsFromObjects on the objects property of the group and concatenates the resulting fonts array with the existing fonts array.
     */
    if (object.type === "Group") {
      // @ts-ignore
      let groupFonts = getFontsFromObjects(object.objects)

      fonts = fonts.concat(groupFonts)
    }
  }
  return fonts
}

/**
 * loadTemplateFonts is an async function that takes a design and loads the fonts from the design editor
 * @param loadTemplateFonts
 */
export const loadTemplateFonts = async (design: IScene) => {
  const fonts = getFontsFromObjects(design.layers)

  if (fonts.length > 0) {
    await loadFonts(fonts)
  }
}

/**
 *  loadFonts is an async function that takes an array of fonts and loads theme
 * 
 * @param fonts 
 * @returns 
 */
export const loadFonts = (fonts: FontItem[]) => {
  const promisesList = fonts.map((font) => {
    return new FontFace(font.name, `url(${font.url})`).load().catch((err) => err)
  })
  return new Promise((resolve, reject) => {
    Promise.all(promisesList)
      .then((res) => {
        res.forEach((uniqueFont) => {
          if (uniqueFont && uniqueFont.family) {
            document.fonts.add(uniqueFont)
            resolve(true)
          }
        })
      })
      .catch((err) => reject(err))
  })
}
