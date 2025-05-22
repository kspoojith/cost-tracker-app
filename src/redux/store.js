import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import itemsReducer from '../features/items/itemsSlice';
import otherCostsReducer from '../features/otherCosts/otherCostsSlice';
import { localStorageMiddleware } from './localStorageMiddleware';

// Optional: Hydrate initial state from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState ? JSON.parse(serializedState) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
  },
  preloadedState: {
    auth: loadFromLocalStorage('auth', { user: null }),
    items: loadFromLocalStorage('items', []),
    otherCosts: loadFromLocalStorage('otherCosts', []),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
