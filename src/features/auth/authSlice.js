import { createSlice } from '@reduxjs/toolkit';

// Load user from localStorage if available
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
  },
  reducers: {
    setUser: (state, action) => {
      const { uid, email } = action.payload;
      state.user = { uid, email };
      localStorage.setItem('user', JSON.stringify(state.user)); // save to localStorage
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('user'); // clear from localStorage
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
