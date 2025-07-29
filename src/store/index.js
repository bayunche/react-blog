import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import articleSlice from './slices/articleSlice'
import themeSlice from './slices/themeSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    article: articleSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch