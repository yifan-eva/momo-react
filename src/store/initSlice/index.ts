import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export const init = createAsyncThunk<boolean>('users/checkAuth', async () => {
  const promise = new Promise<boolean>((resolve, reject) => {
        resolve(true)
  })
  return await promise
})

const initialState = {
  initStatus: false
}
export const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    setInitStatus: (state, action: PayloadAction<boolean>) => {
      state.initStatus = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.initStatus = action.payload
    })
  }
})

export const { setInitStatus } = initSlice.actions
export default initSlice.reducer
