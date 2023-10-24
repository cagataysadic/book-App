import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/auth/authSlice';
import registrationReducer from './slice/register/registrationSlice';
import genreReducer from './slice/genre/genreSlice';
import dashboardReducer from './slice/dashboard/dashboardSlice';
import accountSettingsReducer from './slice/accountSettings/accountSettingsSlice';
import profileReducer from './slice/profile/profileSlice';
import forumReducer from './slice/forum/forumSlice';
import commentReducer from './slice/comment/commentsSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        registration: registrationReducer,
        genre: genreReducer,
        dashboard: dashboardReducer,
        accountSettings: accountSettingsReducer,
        profile: profileReducer,
        forum: forumReducer,
        comments: commentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;