import { shallowEqual, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { RootState } from 'src/redux/rootReducer';

export default function useSocketInput() {
    const { currentUser } = useSelector(
        (root: RootState) => (root.app.session),
        shallowEqual,
    );
    const sendChatSocketMessage = 
        (chatSocket: Socket,  action: string, payload: any) => {
            if (currentUser.id && chatSocket) {
                const withDefaultParams = {
                    ...payload,
                    externalId: currentUser.id,
                };
                chatSocket.emit(action, withDefaultParams);
            } else {
                throw new Error('인터넷 연결을 체크해 주세요.');
            }
        }
    return sendChatSocketMessage;
}