import { createSlice } from '@reduxjs/toolkit';

const metasunganSlice = createSlice({
    name: 'metasungan',
    initialState: {
        metasunganUser: {
            _id: null,
            metaSid: null,
            chatSid: null,
            username: null,
            posOnNewScene: {
                x: null,
                y: null,
            },
            chatBubble: null,
            updatedAt: null,
            chatRoomIds: [],
        },
    },
    reducers: {
        setMetasunganUser: (state, action) => {
            if (action.payload) {
                state.metasunganUser = action.payload;
            }
        },
    },
});

export const metasunganReducer = metasunganSlice.reducer;
export const {
    setMetasunganUser,
} = metasunganSlice.actions;
export const metasunganSelector = state => state.metasungan.metasungan;
