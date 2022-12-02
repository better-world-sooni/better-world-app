import uuid from 'react-native-uuid';
import { TemporaryDirectoryPath, copyFile } from 'react-native-fs';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { Platform } from 'react-native';


export default function useConvertVideo(){
    async function convertVideoIos(videoUri: string): Promise<string> {
        const outputVideoName = `${uuid.v4()}.mp4`;
        const outputVideoUri = `file://${TemporaryDirectoryPath}${outputVideoName}`;
        try {
          await RNFFmpeg.execute(`-y -i ${videoUri} ${outputVideoUri}`);
        } catch (e) {
          throw new Error('Failed to convert the video');
        }
        return outputVideoUri;
    }

    async function convertVideoAndroid(videoUri: string): Promise<string> {
        let fileUri = videoUri;
    
        if (videoUri.startsWith('content://')) {
          try {
            fileUri = await createFileUriFromContentUri(videoUri);
          } catch (e) {
            throw new Error('Failed to create file uri from content uri');
          }
        }
    
        const outputVideoName = `${uuid.v4()}.mp4`;
        const outputVideoUri = `file://${TemporaryDirectoryPath}${outputVideoName}`;
    
        try {
          await RNFFmpeg.execute(`-y -i ${fileUri} ${outputVideoUri}`);
        } catch (e) {
          throw new Error('Failed to convert the video');
        }
    
        return outputVideoUri;
    }
    
    async function createFileUriFromContentUri(contentUri: string): Promise<string> {
        const fileUri = contentUri
          .replace(
            'com.android.providers.media.documents/document/video%3A',
            'media/external/video/media/',
          );
        const uriComponents = fileUri.split('/');
        const fileName = uriComponents[uriComponents.length - 1];
        const newFilePath = `${TemporaryDirectoryPath}${fileName}`;
        await copyFile(contentUri, newFilePath);
    
        return `file://${newFilePath}`;
    }

    return Platform.OS === 'ios' ? convertVideoIos : convertVideoAndroid
}