import {Channel, ChannelEvents} from '@anycable/core';

type nftId = {
  token_id: number;
  contract_address: string;
};

type RoomId = {
  roomId: string | number;
};

type Params = RoomId | nftId;

type EnteringMessage = {
  type: 'enter';
  data: string;
};

type LeavingMessage = {
  type: 'leave';
  data: string;
};

type NewRoomOpen = {
  type: 'new';
  data: string;
};

type RoomMessage = {
  type: 'room';
  message: object;
};

type ListMessage = {
  type: 'list';
  room: object;
};


type ListFetchMessage = {
  type: 'fetchList';
  data: {
    list_data: Array<object>;
    total_unread: number;
  }
};

// type RoomFetchMessage = {
//   type: 'room'
// }

type Message =
  | EnteringMessage
  | NewRoomOpen
  | LeavingMessage
  | RoomMessage
  | ListMessage
  | ListFetchMessage;

interface Events extends ChannelEvents<Message> {
  enter: (msg: EnteringMessage) => void;
  leave: (msg: LeavingMessage) => void;
  new: (msg: NewRoomOpen) => void;
  fetchList: (msg: ListFetchMessage) => void;
  // fetchRoom: (msg: RoomFetchMessage) => void;
  messageRoom: (msg: RoomMessage) => void;
  messageList: (msg: ListMessage) => void;
}

export class ChatChannel extends Channel<Params, Message, Events> {
  static identifier = 'ChatChannel';

  async send(message, room) {
    return this.perform('send_message', {message, room});
  }

  async sendNew(message, room) {
    return this.perform('send_message_new', {message, room});
  }

  async newRoomOpen(roomId) {
    return this.perform('new_room_open', {roomId});
  }

  async enter(roomId) {
    return this.perform('enter_room', {roomId});
  }

  async leave(roomId) {
    return this.perform('leave_room', {roomId});
  }

  async fetchList() {
    return this.perform('fetch_list');
  }

  receive(message: Message) {
    if (message.type === 'enter') {
      return this.emit('enter', message);
    } else if (message.type === 'leave') {
      return this.emit('leave', message);
    } else if (message.type === 'new') {
      return this.emit('new', message);
    } else if (message.type === 'fetchList') {
      return this.emit('fetchList', message);
    } else if (message.type === 'room') {
      return this.emit('messageRoom', message)
    } else if (message.type === 'list') {
      return this.emit('messageList', message)
    }
  }
}
