import apis from "src/modules/apis";
import { fileChecksum } from "src/modules/fileHelper";
import { getKeyFromUri } from "src/modules/uriUtils";
import { promiseFnPure, usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import { Buffer } from 'buffer'
import { isContentTypeImage } from "src/modules/imageUtils";
import useConvertVideo from "./useCovertVideo";

export enum FileUploadReturnType {
    Key,
    BlobSignedId
}
export default function useFileUpload({attachedRecord}){
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
    const convert = useConvertVideo()
    
    const createPresignedUrl = async (name, type, byte_size, checksum, attached_record = "post", metadata = {}) => {
        const body = {
            file: {
                filename: name,
                byte_size: byte_size,
                checksum: checksum,
                content_type: type == "image/jpg" ? "image/jpeg" : type,
                metadata
            },
            attached_record
        }
        const res = await postPromiseFnWithToken({url: apis.presignedUrl._().url, body})
        return res
    }
    const uploadImageToPresignedUrl = async (presignedUrlObject, base64) => {
        const res = await promiseFnPure({url: presignedUrlObject.direct_upload.url, body: Buffer.from(base64, 'base64'), method: 'PUT', headers: {...presignedUrlObject.direct_upload.headers, "Content-Encoding": 'base64'} })
        if(res.status == 200) return res.url
        return ''
    }
    const uploadVideoToPresignedUrl = async (presignedUrlObject, file) => {
        const res = await promiseFnPure({url: presignedUrlObject.direct_upload.url, body: file, method: 'PUT', headers: presignedUrlObject.direct_upload.headers })
        console.log(res, "uploadVideoToPresignedUrl")
        if(res.status == 200) return res.url
        return ''
    }
    const uploadFile = async (file, returnType= FileUploadReturnType.Key) => {
        let blob = null
        if(file.type && file.type.startsWith('video')){
            if(file.type !== 'video/quicktime'){
                const url = await convert(file.uri)
                file.uri = url
                file.type = 'video/mp4'
                file.fileName = url.split('/')[url.split('/').length - 1]
            }
            blob = await (await fetch(file.uri)).blob()
            file.fileSize = blob._data.size
        }
        const checksum = await fileChecksum(file);
        const {data} = await createPresignedUrl(file.fileName, file.type, file.fileSize, checksum, attachedRecord);
        if(isContentTypeImage(file.type)){
            const uploadImageToPresignedUrlRes = await uploadImageToPresignedUrl(data.presigned_url_object, file.base64);
            if (!uploadImageToPresignedUrlRes) throw new Error();
            return returnType == FileUploadReturnType.Key ? getKeyFromUri(uploadImageToPresignedUrlRes) : data.presigned_url_object.blob_signed_id;
        }
        const uploadToPresignedUrlRes = await uploadVideoToPresignedUrl(data.presigned_url_object, blob);
        return returnType == FileUploadReturnType.Key ? getKeyFromUri(uploadToPresignedUrlRes) : data.presigned_url_object.blob_signed_id;
    }
    
    return {uploadFile}
}