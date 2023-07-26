import React from "react"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { DesignType } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Video from "~/components/Icons/Video"
import Images from "~/components/Icons/Images"
import Presentation from "~/components/Icons/Presentation"


//  first view when open web app
// selectEditor is a function to choose editor type (graphic, presentation, video)
const SelectEditor = () => {
  const [selectedEditor, setSelectedEditor] = React.useState<DesignType>("GRAPHIC")
  const { setEditorType } = useDesignEditorContext()

  return (
    <Block
      $style={{
        height: "100vh",
        width: "100vw",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Block>
        <Block
          $style={{
            display: "flex",
            gap: "2rem",
          }}
        >
          
          <Block
            onClick={() => setSelectedEditor("GRAPHIC")}
            $style={{
              height: "180px",
              width: "180px",
              background: selectedEditor === "GRAPHIC" ? "#150259" : "rgb(231, 236, 239)",
              // background: selectedEditor === "GRAPHIC" ? "#000000" : "rgb(231, 236, 239)",
              color: selectedEditor === "GRAPHIC" ? "#ffffff" : "#333333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Images size={34} />
            <Block>Watermark</Block>
          </Block>
          <Block
            onClick={() => setSelectedEditor("PRESENTATION")}
            $style={{
              height: "180px",
              width: "180px",
              background: selectedEditor === "PRESENTATION" ? "#000000" : "rgb(231, 236, 239)",
              color: selectedEditor === "PRESENTATION" ? "#ffffff" : "#333333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Presentation size={36} />
            <Block>Generate Certificate</Block>
          </Block>
          
        </Block>
        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <Button className="w-[1000px]" style={{ width: "180px", background:"#150259"}} onClick={() => setEditorType(selectedEditor)}>
           Continue
          </Button>
        </Block>
      </Block>
    </Block>
  )
}

export default SelectEditor
