import React, {useEffect, useState} from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import useFileUpload from './useFileUpload';

export default function useUploadImageUriKey({uri, attachedRecord}){
    const [image, setImage] = useState({
        uri
    } as any)
    const [uploading, setUploading] = useState(false)
    const {uploadFile} = useFileUpload({attachedRecord})
    const handleAddImage = async () => {
        try {
          const {assets} = await launchImageLibrary({
            includeBase64: true,
            mediaType: 'photo',
            maxHeight: 1600,
            maxWidth: 1600,
          });
          if(assets[0]){
              setImage(assets[0])
          }
        } catch (e) {
        //   console.log(e);
        }
    };
    const handleRemoveImage = () => {
        setImage(null)
    }
    const getImageUriKey = async () => {
        setUploading(true)
        try{
            const key = await uploadFile(image)
            setUploading(false)
            return key
        } catch (e){
            setUploading(false)
            return null
        }
    }
    useEffect(() => {
        setImage({
            uri
        })
    }, [uri])
    const imageHasChanged = image?.uri != uri
    return { image, imageHasChanged, uploading, handleAddImage, handleRemoveImage, getImageUriKey }
}