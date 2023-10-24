import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiInstance from "../../api/api";

export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    userId: {
        userName: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ProfileState {
    books: Book[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    errorMessage: string | null;
    title: string;
    author: string;
    description: string;
    genre: string;
    updateBook: Book | null;
}

const initialState: ProfileState = {
    books: [],
    status: 'idle',
    errorMessage: null,
    title: '',
    author: '',
    description: '',
    genre: '',
    updateBook: null,
}

export const fetchUserBooks = createAsyncThunk(
    'profile/fetchUserBooks',
    async () => {
        const response = await apiInstance.get('/book');
        return response.data;
    }
)

export const updateUserBook = createAsyncThunk(
    'profile/updateUserBook',
    async (payload: {bookId: string, title: string, author: string, description: string, genre: string}) => {
        const response = await apiInstance.put(`/book/${payload.bookId}`, {title: payload.title, author: payload.author, description: payload.description, genre: payload.genre});
        return response.data;
    }
)

export const createUserBook = createAsyncThunk(
    'profile/createUserBook',
    async (payload: {title: string, author: string, description: string, genre: string}) => {
        const response = await apiInstance.post('/book', {title: payload.title, author: payload.author, description: payload.description, genre: payload.genre});
        return response.data;
    }
)

export const deleteUserBook = createAsyncThunk(
    'profile/deleteUserBook',
    async (payload: {id: string}) => {
        await apiInstance.delete(`/book/${payload.id}`);
        return payload.id;
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setAuthor: (state, action: PayloadAction<string>) => {
            state.author = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setGenre: (state, action: PayloadAction<string>) => {
            state.genre = action.payload;
        },
        setUpdateBook: (state, action: PayloadAction<Book | null>) => {
            state.updateBook = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string | null>) => {
            state.errorMessage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
                state.status = 'succeeded';
                state.books = action.payload;
                state.errorMessage = null;
            })
            .addCase(fetchUserBooks.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during fetching user books process.';
            })
            .addCase(updateUserBook.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserBook.fulfilled, (state, action: PayloadAction<Book>) => {
                state.status = 'succeeded';
                const index = state.books.findIndex(book => book._id === action.payload._id);
                if (index >= 0) {
                    state.books[index] = action.payload;
                }
                state.errorMessage = null;
            })
            .addCase(updateUserBook.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during update process.';
            })
            .addCase(createUserBook.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUserBook.fulfilled, (state, action: PayloadAction<Book>) => {
                state.status = 'succeeded';
                state.books.push(action.payload);
                state.errorMessage = null;
            })
            .addCase(createUserBook.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during creating book process.';
            })
            .addCase(deleteUserBook.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUserBook.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.books = state.books.filter((book) => book._id !== action.payload);
                state.updateBook = null;
                state.errorMessage = null;
            })
            .addCase(deleteUserBook.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occred during delete process.';
            })
    },
});

export const { setTitle, setAuthor, setDescription, setGenre, setErrorMessage, setUpdateBook } = profileSlice.actions;
export default profileSlice.reducer;