import apis from 'src/modules/apis';
import {fileChecksum} from 'src/utils/fileUtils';
import {getKeyFromUri} from 'src/utils/uriUtils';
import {promiseFnPure, usePostPromiseFnWithToken} from 'src/redux/asyncReducer';
import {Buffer} from 'buffer';
import {isContentTypeImage} from 'src/utils/imageUtils';
import useConvertVideo from './useConvertVideo';

export enum FileUploadReturnType {
  Key,
  BlobSignedId,
}
export default function useFileUpload({attachedRecord}) {
  const postPromiseFnWithToken = usePostPromiseFnWithToken();
  const convert = useConvertVideo();

  const createPresignedUrl = async (
    name,
    type,
    byte_size,
    checksum,
    attached_record = 'post',
    metadata = {},
  ) => {
    const body = {
      file: {
        filename: name,
        byte_size: byte_size,
        checksum: checksum,
        content_type: type == 'image/jpg' ? 'image/jpeg' : type,
        metadata,
      },
      attached_record,
    };
    const res = await postPromiseFnWithToken({
      url: apis.presignedUrl._().url,
      body,
    });
    return res;
  };
  const uploadToPresignedUrl = async (presignedUrlObject, file) => {
    const res = await promiseFnPure({
      url: presignedUrlObject.direct_upload.url,
      body: file,
      method: 'PUT',
      headers: presignedUrlObject.direct_upload.headers,
    });
    if (res.status == 200) return res.url;
    return '';
  };
  const uploadFile = async (file, returnType = FileUploadReturnType.Key) => {
    if (file.type == 'video/quicktime') {
      const url = await convert(file.uri);
      file.uri = url;
      file.type = 'video/mp4';
      file.fileName = url.split('/')[url.split('/').length - 1];
    }
    const blob = await (await fetch(file.uri)).blob();
    file.fileSize = (blob as any)._data.size;
    if (file.type && file.type == 'image/heic') {
      const fileName = file?.fileName;
      file.fileName = fileName
        .split('.')
        .splice(0, fileName.split('.').length - 1)
        .concat('jpg')
        .join('.');
      const type = file?.type;
      file.type = type
        .split('/')
        .splice(0, type.split('/').length - 1)
        .concat('jpg')
        .join('/');
    }
    const checksum = await fileChecksum(file);
    const {data} = await createPresignedUrl(
      file.fileName,
      file.type,
      file.fileSize,
      checksum,
      attachedRecord,
    );
    const uploadToPresignedUrlRes = await uploadToPresignedUrl(
      data.presigned_url_object,
      blob,
    );
    return returnType == FileUploadReturnType.Key
      ? getKeyFromUri(uploadToPresignedUrlRes)
      : data.presigned_url_object.blob_signed_id;
  };

  return {uploadFile};
}
