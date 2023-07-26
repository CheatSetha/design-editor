import React, { useEffect } from "react"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { DesignType } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Images from "~/components/Icons/Images"
import Presentation from "~/components/Icons/Presentation"
import { BASE_URl } from "~/constants/base-api"
import { useLocation } from "react-router-dom"
import useAppContext from "~/hooks/useAppContext"
import NotFound from "~/constants/no-found"


const SelectEditor = () => {
  const [selectedEditor, setSelectedEditor] = React.useState<DesignType>("GRAPHIC")
  const { setEditorType } = useDesignEditorContext()
  const { currentUser, setCurrentUser } = useAppContext()
  const location = useLocation()
  const routedUrl = location.search
  // @ts-ignore
  const  type = routedUrl.match(/(?<=\?).+?(?=\?)/)[0];
  // @ts-ignore
  const uuid = routedUrl.match(/[^?]+$/)[0];
  setEditorType(type === 'watermark'?"GRAPHIC":"PRESENTATION")
  const getUserinfo = async () => {
    const respone = await fetch(`${BASE_URl}/auth/check-uuid/${uuid}`)
    const data = await respone.json()
    console.log(data?.code, "data from uuid")
    if (data?.code === 200) {
      setCurrentUser(data)
    }
    if (data?.code !== 200) {
      setCurrentUser(null)
    }
  }
  console.log(currentUser, "currentUser")

  useEffect(() => {
    getUserinfo()
  }, [])
  
}

export default SelectEditor
