import React, { useEffect, useState } from "react"
import { DesignType } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { BASE_URl } from "~/constants/base-api"
import { useLocation } from "react-router-dom"
import useAppContext from "~/hooks/useAppContext"
import toast, { Toaster } from "react-hot-toast"
import { valuesIn } from "lodash"

const SelectEditor = () => {
  const { setEditorType } = useDesignEditorContext()
  const { currentUser, setCurrentUser } = useAppContext()
  const location = useLocation()
  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    setTimeout(() => {
      clearInterval(interval)
      window.location.href = "https://photostad.istad.co"
    }, countdown * 1000)

    return () => clearInterval(interval)
  }, [])

  const routedUrl = location.search || "?watermark?sdfjklsfl"
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
  useEffect(() => {
    getUserinfo()
  }, [])

}

export default SelectEditor
