import loadinggif from "~/assets/loading/loading.gif"
function Loading({ text }: { text?: string }) {
  return (
    <div className="w-screen h-screen flex fixed z-50 top-0 bg-black bg-opacity-30 left-0 right-0 justify-center items-center">
      <img className=" " src={loadinggif} alt="loading" />
    </div>
  )
}

export default Loading
