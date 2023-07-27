import React, { useEffect } from "react"
import { DesignType } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { BASE_URl } from "~/constants/base-api"
import { useLocation } from "react-router-dom"
import useAppContext from "~/hooks/useAppContext"
import toast, { Toaster } from 'react-hot-toast';

const SelectEditor = () => {
  const [selectedEditor, setSelectedEditor] = React.useState<DesignType>("GRAPHIC")
  const { setEditorType } = useDesignEditorContext()
  const { currentUser, setCurrentUser } = useAppContext()
  
  const location = useLocation()
  const routedUrl = location.search
  // @ts-ignore
  const type = routedUrl.match(/(?<=\?).+?(?=\?)/)[0]
  // @ts-ignore
  const uuid = routedUrl.match(/[^?]+$/)[0]
  setEditorType(type === "watermark" ? "GRAPHIC" : "PRESENTATION")
  const getUserinfo = async () => {
    const respone = await fetch(`${BASE_URl}/auth/check-uuid/${uuid}`)
    const data = await respone.json()

    if (data?.code === 200) {
      setCurrentUser(data)
      toast.success(`Welcome ${data?.data?.username}`,{
        icon: '🎉',
        duration: 2000,
      })
    }
    if (data?.code !== 200) {
      setCurrentUser(null)
      
    }
  }
  useEffect(() => {
    getUserinfo()
  }, [])
}

export default SelectEditor
