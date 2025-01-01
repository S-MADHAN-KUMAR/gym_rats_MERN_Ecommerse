import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loading: false,
    error: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

        RegisterStart: (state) => {
            state.loading = true;
        },
        RegisterSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        RegisterFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        LoginStart: (state) => {
            state.loading = true;
        },
        LoginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        LoginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        ProfileStart: (state) => {
            state.loading = true;
        },
        ProfileSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        ProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        Logout: (state) => {
            state.currentUser = null; 
            state.loading = false;  
            state.error = null;    
          },
    }
});

export const { LoginStart, LoginSuccess, LoginFailure , RegisterStart , RegisterFailure , RegisterSuccess , ProfileFailure ,ProfileStart , ProfileSuccess ,Logout} = userSlice.actions;

export default userSlice.reducer;