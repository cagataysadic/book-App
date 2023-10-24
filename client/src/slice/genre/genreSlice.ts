import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenreState {
    genres: string[];
    selectedGenre: string | null;
}

const initialState: GenreState = {
    genres: [],
    selectedGenre: null,
};

const genreSlice = createSlice({
    name:'genre',
    initialState,
    reducers: {
        setGenres: (state, action: PayloadAction<string[]>) => {
            state.genres = action.payload;
        },
        setSelectedGenre: (state, action: PayloadAction<string | null>) => {
            state.selectedGenre = action.payload;
        },
        toggleSelectedGenre: (state, action: PayloadAction<string>) => {
            if (state.selectedGenre === action.payload) {
                state.selectedGenre = null;
            } else {
                state.selectedGenre = action.payload;
            }
        },
    },
});

export const { setGenres, setSelectedGenre, toggleSelectedGenre } = genreSlice.actions;
export default genreSlice.reducer;