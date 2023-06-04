import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import React from "react"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"

const Flaticon = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const addObject = React.useCallback(
    (item: any) => {
      if (editor) {
        const test = editor.objects.add(item)
        console.log(test)
      }
    },
    [editor]
  )
  return (
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
        <Block>Flaticon</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
        <Scrollable>
          <Block>
            <Block $style={{ display: "grid", gap: "8px", padding: "1.5rem", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
              {/* gonnal loop items here */}
            </Block>
          </Block>
        </Scrollable>
      </Block>
    </Block>
  )
}

export default Flaticon
