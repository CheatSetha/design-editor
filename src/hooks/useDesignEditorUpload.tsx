import React from "react"
import { AppContext } from "~/contexts/AppContext"


const useDesignEditorUpload = () => {
  const { uploads } = React.useContext(AppContext)
  
  return uploads
}


export default useDesignEditorUpload
