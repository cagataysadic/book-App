import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import apiInstance from "../../api/api";

export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    userId: {
        _id: string;
        userName: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface DashboardState {
    isProfileDropdownVisible: boolean;
    isGenresDropdownVisible: boolean;
    isModalOpen: boolean;
    genres: string[];
    selectedGenre: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorMessage: string | null;
    books: Book[];
}

const initialState: DashboardState = {
    isProfileDropdownVisible: false,
    isGenresDropdownVisible: false,
    isModalOpen: false,
    genres: [],
    selectedGenre: null,
    status: 'idle',
    deleteStatus: 'idle',
    errorMessage: null,
    books: [],
};

export const fetchGenresAndBooks = createAsyncThunk<{ genres: string[], books: Book[] }, void>('dashboard/fetchGenres', async () => {
    const response = await axios.get<Book[]>('/api/book/every');
    const uniqueGenres = Array.from(new Set(response.data.map((book: { genre: string}) => book.genre))) as string[];
    return { genres: uniqueGenres, books: response.data };
});

export const deleteAccount = createAsyncThunk(
    'dashboard/deleteAccount',
    async () => {
        await apiInstance.delete('/user/delete');
        return;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        toggleProfileDropdown: (state, action: PayloadAction<boolean>) => {
            state.isProfileDropdownVisible = action.payload;
        },
        toggleGenresDropdown: (state, action: PayloadAction<boolean>) => {
            state.isGenresDropdownVisible = action.payload;
        },
        toggleModal: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setSelectedGenre: (state, action: PayloadAction<string | null>) => {
            state.selectedGenre = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenresAndBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGenresAndBooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.genres = action.payload.genres;
                state.books = action.payload.books;
            })
            .addCase(fetchGenresAndBooks.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during fetching current genres process';
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.deleteStatus = 'succeeded';
                localStorage.removeItem('token');
            })
            .addCase(deleteAccount.rejected, (state) => {
                state.deleteStatus = 'failed';
                state.errorMessage = 'An error occured during delete user account process';
            })
    },
});

export const { toggleProfileDropdown, toggleGenresDropdown, toggleModal, setSelectedGenre } = dashboardSlice.actions;
export default dashboardSlice.reducer;