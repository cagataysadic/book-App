import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiInstance from "../../api/api";
import axios from "axios";

export interface Post {
    _id: string;
    postText: string;
    userId: {
        _id: string;
        userName: string;
    }
    createdAt: string;
    updatedAt: string;
}

export interface ForumState {
    posts: Post[];
    postText: string;
    search: string;
    showCreateForum: boolean;
    updatePost: Post | null;
    errorMessage: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ForumState = {
    posts: [],
    postText: '',
    search: '',
    showCreateForum: false,
    updatePost: null,
    errorMessage: null,
    status: 'idle',
}

export const fetchUserPosts = createAsyncThunk(
    'forum/fetchUserPosts',
    async () => {
        const response = await axios.get('/api/post/every');
        return response.data;
    }
)

export const createUserPost = createAsyncThunk(
    'forum/createUserPost',
    async ({postText, userId}: {postText: string, userId: string | null}) => {
        const response = await apiInstance.post('/post', { postText, userId });
        return response.data;
    }
)

export const updateUserPost = createAsyncThunk(
    'forum/updateUserPost',
    async ({postId, postText}: {postId: string, postText: string}) => {
        const response = await apiInstance.put(`/post/${postId}`, { postText });
        return response.data;
    }
)

export const deleteUserPost = createAsyncThunk(
    'forum/deleteUserPost',
    async (id: string) => {
        await apiInstance.delete(`/post/${id}`);
        return id;
    }
)

const forumSlice = createSlice({
    name: 'forum',
    initialState,
    reducers: {
        setPostText: (state, action: PayloadAction<string>) => {
            state.postText = action.payload;
        },
        setUpdatePost: (state, action: PayloadAction<Post | null>) => {
            state.updatePost = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setShowCreateForum: (state, action: PayloadAction<boolean>) => {
            state.showCreateForum = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchUserPosts.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during fetching posts process';
            })
            .addCase(createUserPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUserPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.status = 'succeeded';
                state.posts.push(action.payload);
                state.errorMessage = null;
            })
            .addCase(createUserPost.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during creating post process';
            })
            .addCase(updateUserPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.status = 'succeeded';
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index >= 0) {
                    state.posts[index] = action.payload;
                }
                state.errorMessage = null;
            })
            .addCase(updateUserPost.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during updating post process';
            })
            .addCase(deleteUserPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUserPost.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.posts = state.posts.filter((post) => post._id !== action.payload);
                state.updatePost = null;
                state.errorMessage = null;
            })
            .addCase(deleteUserPost.rejected, (state) => {
                state.status = 'failed';
                state.errorMessage = 'An error occured during deleting post process.';
            })
    },
});

export const { setPostText, setUpdatePost, setSearch, setShowCreateForum } = forumSlice.actions;
export default forumSlice.reducer;