import { useCallback } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/rootReducer';

export default function useSocketInput() {
    const { currentUser } = useSelector(
        (root: RootState) => (root.app.session),
        shallowEqual,
    );
    const { chatSocket } = useSelector(
        (root: RootState) => (root.chat),
        shallowEqual,
    );

    const sendChatSocketMessage = useCallback(
        (action: string, payload: any) => {
            if (currentUser.username && chatSocket) {
                const withDefaultParams = {
                    ...payload,
                    username: currentUser.username,
                };
                console.log(withDefaultParams)
                chatSocket.emit(action, withDefaultParams);
            } else {
                throw Error('Network Error while sending socket message!');
            }
        },
        [currentUser?.username, chatSocket]
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
