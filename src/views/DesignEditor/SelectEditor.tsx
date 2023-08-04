import React, { useEffect, useState } from "react"
import { DesignType } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { BASE_URl } from "~/constants/base-api"
import { useLocation, useNavigate } from "react-router-dom"
import useAppContext from "~/hooks/useAppContext"
import toast, { Toaster } from "react-hot-toast"
import { valuesIn } from "lodash"

const SelectEditor = () => {
  const { setEditorType } = useDesignEditorContext()
  const { currentUser, setCurrentUser } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const routedUrl = location.search || "?watermark?sdfjklsfl"
  // @ts-ignore
  const type = routedUrl.match(/(?<=\?).+?(?=\?)/)[0]
  // @ts-ignore
  const uuid = routedUrl.match(/[^?]+$/)[0]

  // setEditorType(type === "watermark" ? "GRAPHIC" : "PRESENTATION")
  const getUserinfo = async () => {
    const respone = await fetch(`${BASE_URl}/auth/check-uuid/${uuid}`)
    const data = await respone.json()

    if (data?.code === 200) {
      setCurrentUser(data)
      toast.success(`Welcome ${data?.data?.username}`, {
        icon: "🎉",
        duration: 2000,
      })
    }
    if (data?.code !== 200) {
      setCurrentUser(null)
      toast.error(`You are being Unauthorized`, {
        icon: "😢",
        duration: 5000,
      })
    }
  }
   // if width < 1000px alert notify to user that this editor is not support on mobile
   if(window.innerWidth < 1000){
    toast.error(`We recomment use bigger screen for better experience `, {
      icon: "😢",
      duration: 100000000000000000,
    })
  }
  if (type === "watermark") {
    navigate(`/watermark?${uuid}`)
  } else {
    navigate(`/generatecertificate?${uuid}`)
  }
  useEffect(() => {
    getUserinfo()
  }, [])
}

export default SelectEditor
