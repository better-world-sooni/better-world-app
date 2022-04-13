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


type ChatMessage = {
  type: 'send'
  data: object
}

type Message = EnteringMessage | LeavingMessage | ChatMessage 

interface Events extends ChannelEvents<Message> {
  enter: (msg: EnteringMessage) => void
  leave: (msg: LeavingMessage) => void
}

export class ChatChannel extends Channel<Params,Message,Events> {
  static identifier = 'ChatChannel'

  async send(message) {
    return this.perform('send_message', {message})
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
    else if(message.type === 'leave') {
      return this.emit('leave', message)
    }
    super.receive(message)
  }
}