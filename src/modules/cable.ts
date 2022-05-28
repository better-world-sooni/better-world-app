import { createCable } from '@anycable/core'
const URL = 'ws://localhost:8080/cable';

function getWebSocketURL(jwt) {
	return `${URL}?token=${jwt}`
}

export const cable = (jwt) => createCable(getWebSocketURL(jwt))