import { useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { chatSocket } from 'src/connections/socket';
import { RootState } from 'src/redux/rootReducer';

export default function useSocketInput() {
    const { currentUser } = useSelector(
        (root: RootState) => (root.app.session),
        shallowEqual,
    );

    const sendChatSocketMessage = useCallback(
        (action: string, payload: any) => {
            if (currentUser.username) {
                const withDefaultParams = {
                    ...payload,
                    defaultParams: {
                        username: currentUser.username,
                    },
                };
                chatSocket.emit(action, withDefaultParams);
            }
        },
        [currentUser.username]
    );

    return sendChatSocketMessage;
}

export const sendChatSocketMessage = (
    action: string,
    payload: any,
    username: string
) => {
    if (username) {
        const withDefaultParams = {
            ...payload,
            defaultParams: {
                username: username,
            },
        };
        chatSocket.emit(action, withDefaultParams);
    }
};
