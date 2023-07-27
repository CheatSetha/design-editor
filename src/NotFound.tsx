import { useEffect, useState } from "react"

export default function NotFound() {
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
  return (
    <div className="grid h-screen w-full  px-4 bg-white place-content-center">
      <div className="text-center skeleton-pulse bg-white">
        <div className="flex justify-center items-center mb-5 ">
          <img src="https://cdn-icons-png.flaticon.com/512/8281/8281994.png" alt="images" className="w-56  "></img>
        </div>
        <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl ">Not Found 404!</p>

        <p className="mt-4 text-gray-600">
          You must be logged in to access this page. You will be redirected back to the home page in {countdown}{" "}
          seconds.
        </p>
      </div>
    </div>
  )
}
