import React, {useEffect, useState} from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useApiPUTWithToken, usePutPromiseFnWithToken, useReloadGETWithToken } from 'src/redux/asyncReducer';
import useFileUpload from './useFileUpload';

export default function useUploadImage({uri, attachedRecord, url, property, successReloadKey}){
    const [image, setImage] = useState({
        uri
    } as any)
    const [uploading, setUploading] = useState(false)
    const putPromiseFnWithToken = usePutPromiseFnWithToken()
    const reloadGetWithToken = useReloadGETWithToken();
    const {uploadFile} = useFileUpload({attachedRecord})
    const handleAddImage = async () => {
        try {
          const {assets} = await launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 600,
            maxHeight: 600,
          });
          if(assets[0]){
              setImage(assets[0])
          }
        } catch (e) {
          console.log(e);
        }
    };
    const handleRemoveImage = () => {
        setImage(null)
    }
    const handleSaveImage = async () => {
        setUploading(true)
        try{
            if(!image) {
                const body = {
                    property,
                }
                const {data} = await putPromiseFnWithToken({url, body})
                if(data.success){
                    reloadGetWithToken(successReloadKey)
                }
                setUploading(false)
                return
            }
            const key = await uploadFile(image)
            const body = {
                property,
                value: key
            }
            const {data} = await putPromiseFnWithToken({url, body})
            if(data.success){
                reloadGetWithToken(successReloadKey)
            }
        } catch (e){
            console.log(e)
        }
        
        setUploading(false)
    }
    useEffect(() => {
        setImage({
            uri
        })
    }, [uri])
    const imageHasChanged = image?.uri !== uri
    return { image, imageHasChanged, uploading, handleAddImage, handleRemoveImage, handleSaveImage }
}