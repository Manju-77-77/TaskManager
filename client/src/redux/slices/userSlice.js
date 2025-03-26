import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    allUsers: null,
    alltasks: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        clearAllUsers: (state) => {
            state.allUsers = null;
        },
        setAllTasks: (state, action) => {
            state.alltasks = action.payload;
        },
        clearAllTasks: (state) => {
            state.alltasks = null;
        },
    },
});

export const { setUser, clearUser, setAllUsers, clearAllUsers, setAllTasks, clearAllTasks } = userSlice.actions;
export default userSlice.reducer;

// Thunk to fetch all users excluding the current user