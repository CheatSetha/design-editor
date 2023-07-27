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
      return (
        <div className="grid h-screen  px-4 bg-white place-content-center">
          <div className="text-center skeleton-pulse bg-white">
            <div className="flex justify-center items-center mb-5 ">
              <img
                src="https://cdn.pixabay.com/animation/2023/03/29/10/53/10-53-26-16_512.gif"
                alt="images"
                className="w-32  "
              ></img>
            </div>
            <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl ">Unauthorized 401!</p>

            <p className="mt-4 text-gray-600">
              You must be logged in to access this page. You will be redirected back to the home page in {countdown}{" "}
              seconds.
            </p>
          </div>
        </div>
      )
    }
  }
  useEffect(() => {
    getUserinfo()
  }, [])
}

export default SelectEditor
