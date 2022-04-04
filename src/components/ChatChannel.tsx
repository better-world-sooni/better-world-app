import { Channel, ChannelEvents } from '@anycable/core'

type Params = {
  roomId: string | number
}

type EnteringMessage = {
  type: 'enter'
  data: string
}

type ChatMessage = {
  type: 'message'
  data: object
}

type Message = EnteringMessage | ChatMessage

interface Events extends ChannelEvents<Message> {
  enter: (msg: EnteringMessage) => void
}

export class ChatChannel extends Channel<Params,Message,Events> {
  static identifier = 'ChatChannel'

  async send(message) {
    return this.perform('send_message', {message})
  }

  async enter() {
    return this.perform('enter_room')
  }
  
  receive(message: Message) {
    if (message.type === 'enter') {
      return this.emit('enter', message)
    }
    super.receive(message)
  }
}