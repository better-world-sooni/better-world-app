import { useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { RootState } from 'src/redux/rootReducer';

export default function useSocketInput() {
    const { currentUser } = useSelector(
        (root: RootState) => (root.app.session),
        shallowEqual,
    );
    const sendChatSocketMessage = useCallback(
        (chatSocket: Socket,  action: string, payload: any) => {
            if (currentUser.id && chatSocket) {
                const withDefaultParams = {
                    ...payload,
                    externalId: currentUser.id,
                };
                chatSocket.emit(action, withDefaultParams);
            } else {
                throw Error('Network Error while sending socket message!');
            }
        },
        [currentUser?.id]
    );

    return sendChatSocketMessage;
}

// export const sendChatSocketMessage = (
//     action: string,
//     payload: any,
//     username: string
// ) => {
//     if (username) {
//         const withDefaultParams = {
//             ...payload,
//             defaultParams: {
//                 username: username,
//             },
//         };
//         chatSocket.emit(action, withDefaultParams);
//     }
// };
