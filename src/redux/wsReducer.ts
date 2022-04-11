import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel'



export const connectWs = (jwt) => async dispatch => {
	dispatch(wsActions.loading());
	try {
			let channel = new ChatChannel({ roomId: 2 });
			await cable(jwt).subscribe(channel);
			dispatch(wsActions.connect(channel))

	} catch (error) {
		dispatch(wsActions.error(error))
	}
};

const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    loading: false,
    data: null,
    error: null
  },
  reducers: {
    loading(state) {
        state.loading = true;
    },
    connect(state, action) {
        const channel = action.payload;
        state.loading = false;
        state.data = channel;
    },
    error(state, action) {
        const error = action.payload;
        state.loading = false;
        state.error = error;
    }
  },
});

export const wsReducer = wsSlice.reducer;
export const wsActions = wsSlice.actions;