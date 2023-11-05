import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    currentUser: null,

};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailuer: (state, action)  => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        updateUserFailuer: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) => {
            state.loading = false;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null
        },
        deleteUserFailuer: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {signInStart,
    signInSuccess, 
    signInFailuer, 
    updateUserFailuer, 
    updateUserSuccess, 
    updateUserStart, deleteUserFailuer, deleteUserSuccess, deleteUserStart} = userSlice.actions;

export default userSlice.reducer;