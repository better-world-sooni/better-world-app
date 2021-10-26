import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatSocket: null,
        chatRooms: {},
        chatHeadEnabled: false,
        chatBody: {
            enabled: false,
            enabledRoomId: null
        }
    },
    reducers: {
        setSocket: (state, action) => {
            state.chatSocket = action.payload;
        },
        setChatRoom: (state, action) => {
            if (action.payload) {
                state.chatRooms[action.payload._id] = action.payload;
            }
        },
        pushNewMessage: (state, action) => {
            console.log('pushNewMessage pushNewMessage', action.payload)
            state.chatRooms[action.payload.roomId].messages.unshift(action.payload.message);
        },
        setChatRooms: (state, action) => {
            if (action.payload) {
                state.chatRooms = action.payload;
            }
        },
        setChatHeadEnabled: (state, action) => {
            if (action.payload) {
                state.chatBody.enabled = false;
            }
            state.chatHeadEnabled = action.payload;
        },
        setChatBodyEnabled: (state, action) => {
            if (action.payload) {
                state.chatHeadEnabled = false;
            }
            state.chatBody.enabled = action.payload;
        },
        setChatBody: (state, action) => {
            if (action.payload.enabled) {
                state.chatHeadEnabled = false;
            }
            state.chatBody = action.payload;
        },
        toggleChatHeadBodyEnabled: (state, action) => {
            state.chatBody.enabled = action.payload.chatBody;
            state.chatHeadEnabled = action.payload.chatHead;
        },
        chatLogout: (state) => {
            state = {
                chatSocket: null,
                chatRooms: {},
                chatHeadEnabled: false,
                chatBody: {
                    enabled: false,
                    enabledRoomId: null
                }
            }
        },
    },
});

export const chatReducer = chatSlice.reducer;
export const {
    setSocket,
    setChatRoom,
    setChatRooms,
    pushNewMessage,
    setChatHeadEnabled,
    setChatBodyEnabled,
    setChatBody,
    toggleChatHeadBodyEnabled,
    chatLogout,
} = chatSlice.actions;
export const chatSelector = state => state.chat.chat;
