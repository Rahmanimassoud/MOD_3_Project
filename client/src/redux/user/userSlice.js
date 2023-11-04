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
        }
    }
});

export const {signInStart, signInSuccess, signInFailuer} = userSlice.actions;

export default userSlice.reducer;