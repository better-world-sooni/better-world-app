import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatSocket: null,
        chatRooms: {},
        chatHead: {
            enabled: false,
        },
        chatBody: {
            enabled: false,
            enabledRoomId: null
        }
    },
    reducers: {
        setSocket: (state, action) => {
            if (action.payload) {
                state.chatSocket = action.payload;
            }
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
            state.chatHead.enabled = action.payload;
        },
        setChatBodyEnabled: (state, action) => {
            if (action.payload) {
                state.chatHead.enabled = false;
            }
            state.chatBody.enabled = action.payload;
        },
        setChatBody: (state, action) => {
            if (action.payload.enabled) {
                state.chatHead.enabled = false;
            }
            state.chatBody = action.payload;
        },
        toggleChatHeadBodyEnabled: (state, action) => {
            state.chatBody.enabled = action.payload.chatBody;
            state.chatHead.enabled = action.payload.chatHead;
        },
        chatLogout: (state) => {
            state = {
                chatSocket: null,
                chatRooms: {},
                chatHead: {
                    enabled: false,
                },
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
