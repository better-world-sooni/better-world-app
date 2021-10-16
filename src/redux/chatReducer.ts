import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        rooms: [],
        chatHead: {
            enabled: false,
        },
    },
    reducers: {
        pushNewRoom: (state, action) => {
            if (action.payload) {
                state.rooms.push(action.payload);
            }
        },
        setChatHeadEnabled: (state, action) => {
            if (action.payload) {
                state.chatHead.enabled = action.payload;
            }
        },
    },
});

export const chatReducer = chatSlice.reducer;
export const {
    pushNewRoom,
    setChatHeadEnabled,
} = chatSlice.actions;
export const chatSelector = state => state.chat.chat;
