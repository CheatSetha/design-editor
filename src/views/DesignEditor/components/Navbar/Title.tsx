import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export default function Title() {
    const {editorType, setEditorType } = useDesignEditorContext()
  return (
    <div className="text-white text-center">{editorType}</div>
  )
}