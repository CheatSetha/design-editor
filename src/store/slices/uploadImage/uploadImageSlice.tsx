import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Upload {
  id: string
  src: string
  preview: string
  type: "StaticImage" | "StaticVideo"
}

interface UploadsState {
  uploads: Upload[]
}

const initialState: UploadsState = {
  uploads: [],
}

const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    addUploads: (state, action: PayloadAction<Upload[]>) => {
      state.uploads.push(...action.payload)
    },
    clearUploads: (state) => {
      state.uploads = []
    },
  },
})

export const { addUploads, clearUploads } = uploadsSlice.actions

export default uploadsSlice.reducer
