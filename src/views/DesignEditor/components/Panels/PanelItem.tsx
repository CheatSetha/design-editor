import React from "react"
import useAppContext from "~/hooks/useAppContext"
import panelItems from "./panelItems"
import useIsSidebarOpen from "~/hooks/useIsSidebarOpen"
import { Block } from "baseui/block"

interface State {
  panel: string
}
const PanelsList = () => {
  const [state, setState] = React.useState<State>({ panel: "Text" })
  const isSidebarOpen = useIsSidebarOpen()
  const { activePanel, activeSubMenu } = useAppContext()
  // console.log(" test "+ isSidebarOpen);

  React.useEffect(() => {
    // this is for when we click on the sub menu item
    // it will change the panel to the sub menu item
    // and when we click on the panel item it will change the panel to the panel item
    setState({ panel: activePanel })
  }, [activePanel])

  React.useEffect(() => {
    // this is for when we click on the sub menu item
    /*
    check if the activeSubMenu is not null
    it's will change the panel to the sub menu item
    esle it will change the panel to the panel item
     */
    if (activeSubMenu) {
      setState({ panel: activeSubMenu })
    } else {
      setState({ panel: activePanel })
    }
  }, [activeSubMenu])

  //  @ts-ignore
  const Component = panelItems[state.panel]
  // console.log(Component +"panelItem");

  return (
    <Block
      id="EditorPanelItem"
      $style={{
        background: "#ffffff",
        width: isSidebarOpen ? "306px" : 0,
        flex: "none",
        borderRight: "1px solid #d7d8e3",
        display: "flex",
        transition: "ease width 0.1s",
        overflow: "hidden",
      }}
    >
    {/* check if componet true show component */}
      {Component && <Component />}
    </Block>
  )
}

export default PanelsList
