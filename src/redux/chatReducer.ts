import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
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
    setChatHeadEnabled,
    setChatBodyEnabled,
    setChatBody,
    setCurrentChatRoomId,
    toggleChatHeadBodyEnabled,
    chatLogout,
} = chatSlice.actions;
export const chatSelector = state => state.chat.chat;
