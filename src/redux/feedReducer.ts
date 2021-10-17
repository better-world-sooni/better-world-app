import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        prevPosts: [],
        newPosts: [],
        cachedPreup: null,
    },
    reducers: {
        setPrevPosts: (state, action) => {
            if (action.payload) {
                state.prevPosts = [...action.payload].reverse();
            }
        },
        setNewPosts: (state, action) => {
            if (action.payload && action.payload.length > 0) {
                state.newPosts = [...action.payload].reverse();
            }
        },
        setCachedPreup: (state, action) => {
            state.cachedPreup = action.payload;
        }
    },
});

export const feedReducer = feedSlice.reducer;
export const {
    setPrevPosts,
    setNewPosts,
    setCachedPreup,
} = feedSlice.actions;
