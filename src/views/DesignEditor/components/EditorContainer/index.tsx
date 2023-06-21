import React from "react"
import { Block } from "baseui/block"
// this component is used in src\views\DesignEditor\components\EditorContainer\index.tsx 
// it's use for wrapping the children components
const EditorContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      $style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        fontFamily: "Poppins",
      }}
    >
      
      {children} 
    </Block>
  )
}

export default EditorContainer
