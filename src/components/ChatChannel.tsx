import { Channel, ChannelEvents } from '@anycable/core'

type UserUuid = {
  userUuid: string
}

type RoomId = {
  roomId: string | number
}

type Params = RoomId | UserUuid

type EnteringMessage = {
  type: 'enter'
  data: string
}

type LeavingMessage = {
  type: 'leave'
  data: string
}


type UpdatingMessage = {
  type: 'update'
  data: object
}

type ChatMessage = {
  type: 'send'
  data: object
}

type Message = EnteringMessage | LeavingMessage | ChatMessage | UpdatingMessage

interface Events extends ChannelEvents<Message> {
  enter: (msg: EnteringMessage) => void
  leave: (msg: LeavingMessage) => void
  update: (msg: UpdatingMessage) => void
}

export class ChatChannel extends Channel<Params,Message,Events> {
  static identifier = 'ChatChannel'

  async send(message) {
    return this.perform('send_message', {message})
  }

  async update(message) {
    return this.perform('update_read_count', {message})
  }

  async enter() {
    return this.perform('enter_room')
  }
  
  async leave() {
    return this.perform('leave_room')
  }
  
  receive(message: Message) {
    if (message.type === 'enter') {
      return this.emit('enter', message)
    }
    else if(message.type === 'update') {
      return this.emit('update', message)
    }
    else if(message.type === 'leave') {
      return this.emit('leave', message)
    }
    super.receive(message)
  }
}