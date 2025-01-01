import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentAdmin: null,
    loading: false,
    error: false
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        AdminLoginStart: (state) => {
            state.loading = true;
        },
        AdminLoginSuccess: (state, action) => {
            state.currentAdmin = action.payload;
            state.loading = false;
            state.error = false;
        },
        AdminLoginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        AdminLogout: (state) => {
            state.currentAdmin = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { AdminLoginStart, AdminLoginSuccess, AdminLoginFailure, AdminLogout } = adminSlice.actions;

export default adminSlice.reducer;
