import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiInstance from '../../api/api';

export interface accountSettings {
    password: string;
    newUserName: string;
    newEmail: string;
    newPassword: string;
    confirmNewPassword: string;
    isLocked: boolean;
    errorMessage: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: accountSettings = {
    password: '',
    newUserName: '',
    newEmail: '',
    newPassword: '',
    confirmNewPassword: '',
    isLocked: true,
    errorMessage: null,
    status: 'idle',
};


export const fetchUser = createAsyncThunk(
    'accountSettings/fetchUser',
    async () => {
        const response = await apiInstance.get('/user/me');
        return response.data;
    }
);

export const handleValidatePassword = createAsyncThunk(
    'accountSettings/validatePassword',
    async (payload: {currentPassword: string}) => {
        const response = await apiInstance.post('/user/validate', payload);
          return response.data;
    }
);

export const handleUserUpdate = createAsyncThunk(
    'accountSettings/handleUserUpdate',
    async (userData: { userName: string; email: string; }) => {
        const response = await apiInstance.patch('/user/update', userData);
        return response.data;
    }
);

export const passwordUpdate = createAsyncThunk(
    'accountSettings/passwordUpdate',
    async (newPassword: string) => {
        const response = await apiInstance.patch('/user/update', newPassword);
        return response.data
    }
);

const accountSettingsSlice = createSlice({
    name: 'accounSettings',
    initialState,
    reducers: {
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setNewUserName: (state, action: PayloadAction<string>) => {
            state.newUserName = action.payload;
        },
        setNewEmail: (state, action: PayloadAction<string>) => {
            state.newEmail = action.payload;
        },
        setNewPassword: (state, action: PayloadAction<string>) => {
            state.newPassword = action.payload;
        },
        setConfirmNewPassword: (state, action: PayloadAction<string>) => {
            state.confirmNewPassword = action.payload;
        },
        setIsLocked: (state, action: PayloadAction<boolean>) => {
            state.isLocked = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string | null>) => {
            state.errorMessage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.errorMessage = null;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during fetching user credentials process';
            })
            .addCase(handleValidatePassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(handleValidatePassword.fulfilled, (state) => {
                state.status = 'succeeded';
                state.errorMessage = null;
            })
            .addCase(handleValidatePassword.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during password validation process';
            })
            .addCase(handleUserUpdate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(handleUserUpdate.fulfilled, (state) => {
                state.status = 'succeeded';
                state.errorMessage = null;
            })
            .addCase(handleUserUpdate.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during update process';
            })
            .addCase(passwordUpdate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(passwordUpdate.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(passwordUpdate.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during password update process';
            })
    },
});

export const { setPassword, setNewUserName, setNewEmail, setNewPassword, setConfirmNewPassword, setIsLocked, setErrorMessage } = accountSettingsSlice.actions;
export default accountSettingsSlice.reducer;