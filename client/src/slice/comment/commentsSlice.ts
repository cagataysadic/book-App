import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import apiInstance from '../../api/api';

export interface Comment {
  _id: string;
  commentText: string;
  userId: {
    _id: string;
    userName: string;
  }
  createdAt: string;
  updatedAt: string;
}

interface CommentsState {
  commentsByPostId: { [key: string]: Comment[] };
  newComment: string;
  loading: boolean;
  errorMessage: string | null;
}

interface FetchCommentsResponse {
  postId: string;
  comments: Comment[];
}

interface CreateCommentPayload {
  postId: string;
  commentText: string;
}

interface CreateCommentResponse {
  postId: string;
  comment: Comment;
}

interface UpdateCommentPayload {
    postId: string;
    commentId: string;
    commentText: string;
}
  
interface UpdateCommentResponse {
    postId: string;
    comment: Comment;
}

interface DeleteCommentPayload {
    postId: string;
    commentId: string;
}

interface DeleteCommentResponse {
    postId: string;
    commentId: string;
}

export const fetchUserComments = createAsyncThunk(
  'comments/fetchUserComments',
  async (postId: string, thunkAPI): Promise<FetchCommentsResponse> => {
    const response = await axios.get<Comment[]>(`/api/post/${postId}/comments`);
    return { postId, comments: response.data };
  }
);

export const createUserComment = createAsyncThunk(
  'comments/createUserComment',
  async ({ postId, commentText }: CreateCommentPayload, thunkAPI): Promise<CreateCommentResponse> => {
    const response = await apiInstance.post<Comment>(`/post/${postId}/comment`, { commentText });
    return { postId, comment: response.data };
  }
);

export const updateUserComment = createAsyncThunk(
    'comments/updateUserComment',
    async ({ postId, commentId, commentText }: UpdateCommentPayload, thunkAPI): Promise<UpdateCommentResponse> => {
        const response = await apiInstance.put<Comment>(`/post/${postId}/comment/${commentId}`, { commentText });
        return { postId, comment: response.data }
    }
);

export const deleteUserComment = createAsyncThunk(
    'comments/deleteUserComment',
    async ({ postId, commentId }: DeleteCommentPayload, thunkAPI): Promise<DeleteCommentResponse> => {
        await apiInstance.delete(`/post/${postId}/comment/${commentId}`);
        return {postId, commentId};
    }
)

const initialState: CommentsState = {
  commentsByPostId: {},
  newComment: '',
  loading: false,
  errorMessage: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setNewComment: (state, action: PayloadAction<string>) => {
      state.newComment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserComments.fulfilled, (state, action: PayloadAction<FetchCommentsResponse>) => {
        const { postId, comments } = action.payload;
        state.commentsByPostId[postId] = comments;
        state.loading = false;
      })
      .addCase(fetchUserComments.rejected, (state) => {
        state.errorMessage = 'An error occured during fetching comments process';
      })
      .addCase(createUserComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserComment.fulfilled, (state, action: PayloadAction<CreateCommentResponse>) => {
        const { postId, comment } = action.payload;
        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [];
        }
        state.commentsByPostId[postId].push(comment);
        state.newComment = '';
        state.loading = false;
      })
      .addCase(createUserComment.rejected, (state) => {
        state.errorMessage = 'An error occured during creating user comment process';
      })
      .addCase(updateUserComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserComment.fulfilled, (state, action: PayloadAction<UpdateCommentResponse>) => {
        const { postId, comment } = action.payload;
        const index = state.commentsByPostId[postId].findIndex(Comment => Comment._id === comment._id);
        if (index >= 0) {
            state.commentsByPostId[postId][index] = comment;
        }
        state.loading = false;
        state.errorMessage = null;
      })
      .addCase(updateUserComment.rejected, (state) => {
        state.errorMessage = 'An error occured during updating user comment process';
      })
      .addCase(deleteUserComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserComment.fulfilled, (state, action: PayloadAction<DeleteCommentPayload>) => {
        const { postId, commentId } = action.payload;
        state.commentsByPostId[postId].filter((comment) => comment._id !== commentId);
        state.loading = false;
        state.errorMessage = null;
      })
      .addCase(deleteUserComment.rejected, (state) => {
        state.errorMessage = 'An error occured during user comment delete process';
      })
  },
});

export const { setNewComment } = commentsSlice.actions;

export default commentsSlice.reducer;