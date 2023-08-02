import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import logo from "~/assets/logos/mainlogov2.png"
export default function Title() {
    const {editorType, setEditorType } = useDesignEditorContext()
  return (
    <a className="w-full flex justify-center" href="https://photostad.istad.co">
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </a>
  )
}