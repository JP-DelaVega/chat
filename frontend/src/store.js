import { configureStore } from '@reduxjs/toolkit';
import dbReducer from './slices/dbSlice';

export const store = configureStore({
  reducer: {
    database: dbReducer,
    // your other reducers...
  },
});