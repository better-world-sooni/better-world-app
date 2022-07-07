import {Channel, ChannelEvents} from '@anycable/core';


type RoomId = {
  roomId: string | number;
};

type NftId = {
  contract_address: string;
  token_id: number;
}


type Params = RoomId | NftId;


type EnteringMessage = {
  type: 'enter';
  entered_nfts: Array<NftId>;
  update_msgs: Array<object>;
  enter_nft: NftId;
};

type LeavingMessage = {
  type: 'leave';
  leave_nft: NftId;
};

type RoomMessage = {
  type: 'room';
  message: object;
};

type ListMessage = {
  type: 'list';
  room: object;
  read: boolean;
};

type ListFetchMessage = {
  type: 'fetchList';
  data: {
    list_data: Array<object>;
    total_unread: number;
  }
};

type NextPageMessage = {
  type: 'nextPage';
  messages: Array<object>;
}

type Message =
  | EnteringMessage
  | LeavingMessage
  | RoomMessage
  | ListMessage
  | ListFetchMessage
  | NextPageMessage;

interface Events extends ChannelEvents<Message> {
  enter: (msg: EnteringMessage) => void;
  leave: (msg: LeavingMessage) => void;
  fetchList: (msg: ListFetchMessage) => void;
  messageRoom: (msg: RoomMessage) => void;
  messageList: (msg: ListMessage) => void;
  nextPageMessage: (msg: NextPageMessage) => void;
}

export class ChatChannel extends Channel<Params, Message, Events> {
  static identifier = 'ChatChannel';

  async send(message, myRoom, opponentRoom, opponentNft) {
    return this.perform('send_message', {message, myRoom, opponentRoom, opponentNft});
  }

  async enter() {
    return this.perform('enter_room');
  }

  async fetchList() {
    return this.perform('fetch_list');
  }

  async nextPage(page) {
    return this.perform('fetch_page_messages', {page})
  }

  receive(message: Message) {
    if (message.type === 'enter') {
      return this.emit('enter', message);
    } else if (message.type === 'leave') {
      return this.emit('leave', message);
    } else if (message.type === 'fetchList') {
      return this.emit('fetchList', message);
    } else if (message.type === 'room') {
      return this.emit('messageRoom', message)
    } else if (message.type === 'list') {
      return this.emit('messageList', message)
    } else if (message.type === 'nextPage') {
      return this.emit('nextPageMessage', message)
    }
  }
}
