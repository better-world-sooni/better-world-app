import { createSlice } from '@reduxjs/toolkit'

const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    data: {},
  },
  reducers: {
    show(state, action) {
      const { id } = action.payload
      state.data[id] = action.payload
    },
    close(state, action) {
      const { id } = action.payload
      state.data[id] = null
    },
  },
})

export const popupReducer = popupSlice.reducer
export const popupActions = popupSlice.actions
