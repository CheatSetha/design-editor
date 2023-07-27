import { useEffect, useState } from "react"

export default function Unauthorized() {
  const [countdown, setCountdown] = useState(5)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCountdown((prevCountdown) => prevCountdown - 1)
//     }, 1000)

//     setTimeout(() => {
//       clearInterval(interval)
//       window.location.href = "https://photostad.istad.co"
//     }, countdown * 1000)

//     return () => clearInterval(interval)
//   }, [])
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
