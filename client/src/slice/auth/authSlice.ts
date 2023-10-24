import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    userId: string | null;
    token: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    isLoggedIn: false,
    userId: null,
    token: null,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;            
        },
        setUserId: (state, action: PayloadAction<string | null>) => {
            state.userId = action.payload;
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoggedIn, setUserId, setToken, setLoading } = authSlice.actions;
export default authSlice.reducer;