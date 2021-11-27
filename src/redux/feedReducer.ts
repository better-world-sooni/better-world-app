import { createSlice } from '@reduxjs/toolkit';
import { MAIN_LINE2 } from 'src/modules/constants';
import { postKey } from 'src/modules/utils';

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        globalFiter: MAIN_LINE2,
        currentPostId: null,
    },
    reducers: {
        setGlobalFilter: (state, action) => {
            state.globalFiter = action.payload;
        },
    },
});

export const feedReducer = feedSlice.reducer;
export const {
    setGlobalFilter,
} = feedSlice.actions;
