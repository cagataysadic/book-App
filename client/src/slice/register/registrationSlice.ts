import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface RegistrationState {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    errorMessage: string | null;
    status: 'idle' | 'loading' | 'succeeded' |'failed';
}

const initialState: RegistrationState = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: null,
    status: 'idle',
};

export const registerUser = createAsyncThunk(
    'registration/registerUser',
    async (userData: { userName: string; email: string; password: string; }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/user/register', userData);
            return response.data
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const loginUser = createAsyncThunk(
    'registration/loginUser',
    async (userData: { email: string; password: string; }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/user/login', userData);
            return response.data
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
        }
    }
);

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setConfirmPassword: (state, action: PayloadAction<string>) => {
            state.confirmPassword = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string | null>) => {
            state.errorMessage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.errorMessage = null;
            })
            .addCase(registerUser.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.errorMessage = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
            })
    },
});

export const { setUserName, setEmail, setPassword, setConfirmPassword, setErrorMessage } = registrationSlice.actions;
export default registrationSlice.reducer;