import { configureStore } from '@reduxjs/toolkit'
import initSlice from './initSlice'


export const store = configureStore({
  reducer: {
    init: initSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
