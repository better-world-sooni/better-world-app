import { createCable } from '@anycable/core'
const URL = 'ws://3.39.22.255:8080/cable';

function getWebSocketURL(jwt) {
	return `${URL}?token=${jwt}`
}

export const cable = (jwt) => createCable(getWebSocketURL(jwt))