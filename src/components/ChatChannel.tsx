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

type ChatMessage = {
  type: 'send';
  data: object;
};

type FetchMessage = {
  type: 'fetch';
  data: object;
};

type Message =
  | EnteringMessage
  | NewRoomOpen
  | LeavingMessage
  | ChatMessage
  | FetchMessage;

interface Events extends ChannelEvents<Message> {
  enter: (msg: EnteringMessage) => void;
  leave: (msg: LeavingMessage) => void;
  new: (msg: NewRoomOpen) => void;
  fetch: (msg: FetchMessage) => void;
}

export class ChatChannel extends Channel<Params, Message, Events> {
  static identifier = 'ChatChannelWeb';

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
    console.log(message)
    if (message.type === 'enter') {
      return this.emit('enter', message);
    } else if (message.type === 'leave') {
      return this.emit('leave', message);
    } else if (message.type === 'new') {
      return this.emit('new', message);
    } else if (message.type === 'fetch') {
      return this.emit('fetch', message);
    }
    super.receive(message);
  }
}
