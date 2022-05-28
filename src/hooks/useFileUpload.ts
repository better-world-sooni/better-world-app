import apis from "src/modules/apis";
import { fileChecksum } from "src/modules/fileHelper";
import { getKeyFromUri, removeQueryFromUri } from "src/modules/uriUtils";
import { promiseFnPure, usePostPromiseFnWithToken } from "src/redux/asyncReducer";

export enum FileUploadReturnType {
    Key,
    BlobSignedId
}
export default function useFileUpload({attachedRecord}){
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
    
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
    const uploadToPresignedUrl = async (presignedUrlObject, file) => {
        const res = await promiseFnPure({url: presignedUrlObject.direct_upload.url, body: file, method: 'PUT', headers: presignedUrlObject.direct_upload.headers })
        if(res.status == 200) return res.url
        return false
    }
    const uploadFile = async (file, returnType= FileUploadReturnType.Key) => {
        const blob = await (await fetch(file.uri)).blob()
        const checksum = await fileChecksum(file);
        const {data} = await createPresignedUrl(file.fileName, file.type, file.fileSize, checksum, attachedRecord);
        const uploadToPresignedUrlRes = await uploadToPresignedUrl(data.presigned_url_object, blob);
        if (!uploadToPresignedUrlRes) throw new Error();
        return returnType == FileUploadReturnType.Key ? getKeyFromUri(uploadToPresignedUrlRes) : data.presigned_url_object.blob_signed_id;
    }
    
    return {uploadFile}
}