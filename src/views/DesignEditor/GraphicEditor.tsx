import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"
import useAppContext from "~/hooks/useAppContext"
import Loading from "~/components/Loading"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const GraphicEditor = () => {
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
  const { currentUser } = useAppContext()
  if (currentUser === null) {
    return (
      <div className="grid h-screen w-full  px-4 bg-white place-content-center">
        <div className="text-center skeleton-pulse bg-white">
          <div className="flex justify-center items-center mb-5 ">
            <img src="https://cdn-icons-png.flaticon.com/512/4926/4926183.png" alt="images" className="w-56  "></img>
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
  return (
    <EditorContainer>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <Toolbox />
          <Canvas />
          <Footer />
        </div>
      </div>
    </EditorContainer>
  )
}

export default GraphicEditor
