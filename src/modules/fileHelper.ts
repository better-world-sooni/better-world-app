import RNFS from 'react-native-fs'
import { Buffer } from 'buffer'


export const fileChecksum = async (file) => {
	const hex = await RNFS.hash(file.uri, 'md5')
	const checksum = Buffer.from(hex, 'hex').toString('base64')
  return checksum
}