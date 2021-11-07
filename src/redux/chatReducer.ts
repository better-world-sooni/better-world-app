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
        },
        currentChatRoom: {
            roomId: null
        },
    },
    reducers: {
        setChatSocket: (state, action) => {
            state.chatSocket = action.payload;
        },
        setChatRoom: (state, action) => {
            if (action.payload) {
                state.chatRooms[action.payload._id] = action.payload;
            }
        },
        pushNewMessage: (state, action) => {
            state.chatRooms[action.payload.roomId].messages.push(action.payload.message);
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
        setCurrentChatRoomId: (state, action) => {
            state.currentChatRoom.roomId = action.payload;
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
                },
                currentChatRoom: {
                    roomId: null
                }
            }
        },
    },
});

export const chatReducer = chatSlice.reducer;
export const {
    setChatSocket,
    setChatRoom,
    setChatRooms,
    pushNewMessage,
    setChatHeadEnabled,
    setChatBodyEnabled,
    setChatBody,
    setCurrentChatRoomId,
    toggleChatHeadBodyEnabled,
    chatLogout,
} = chatSlice.actions;
export const chatSelector = state => state.chat.chat;
