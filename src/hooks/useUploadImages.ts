import{ useState} from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import useFileUpload, { FileUploadReturnType } from './useFileUpload';

export default function useUploadImages({attachedRecord = "post", selectionLimit = 0, fileLimit=4}){
    const [images, setImages] = useState([])
    const [video, setVideo] = useState(null)
    const [error, setError] = useState('')
    const {uploadFile} = useFileUpload({attachedRecord})
    const handleAddImages = async () => {
        try {
          const {assets} = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit,
            maxHeight: 1600,
            maxWidth: 1600,
            includeBase64: true,
          });
          const targetFilesLength = assets.length;
            if (targetFilesLength === 0) {
                return;
            }
            if (images.length + targetFilesLength > fileLimit) {
                setError(`미디어는 ${fileLimit}개 이상 선택하실 수 없습니다.`);
                return;
            }
            const additionalFiles = [];
            for (let fileIndex = 0; fileIndex < targetFilesLength; fileIndex++) {
                additionalFiles.push(createFileObject(assets[fileIndex]));
            }
            setImages([...images, ...additionalFiles])
            setError("");
        } catch (e) {
          console.log(e);
        }
    };
    const handleAddVideo = async () => {
      try {
        const {assets} = await launchImageLibrary({
          mediaType: 'video',
          selectionLimit: 1,
          maxHeight: 1600,
          maxWidth: 1600,
          includeBase64: true,
        });
          setVideo(createFileObject(assets[0]))
          setError("");
      } catch (e) {
        console.log(e);
      }
  };
    const createFileObject = (file) => {
      const fileObject = {
        ...file,
        loading: false,
      };
      return fileObject;
    };
    const handleRemoveImage = (index) => {
        const reducedArray = [...images];
        reducedArray.splice(index, 1);
		    setError("");
        setImages(reducedArray)
    }
    const handleRemoveVideo = () => {
      setError("");
      setVideo(null)
  }
    const uploadAllSelectedFiles = async () => {
      try {
        const signedIdArray = await Promise.all(images.map((file, index) => uploadFileAtIndex(index)));
        return signedIdArray;
      } catch (e){
        console.log(e)
        setError("이미지 업로드중 문제가 발생하였습니다.");
        setImages(setAllSelectedFileNotLoading);
        return [];
      }
    };
    const uploadVideo = async () => {
      try {
        const signedId = await updateVideoUploadStatus();
        return signedId;
      } catch (e){
        console.log(e)
        setError("이미지 업로드중 문제가 발생하였습니다.");
        setVideo({...video, loading: false});
        return [];
      }
    };
    const setAllSelectedFileNotLoading = (prevSelectedFiles) => {
      const newSelectedFiles = prevSelectedFiles.map((file) => {
        file.loading = false;
        return file;
      });
      return newSelectedFiles;
    };
    const uploadFileAtIndex = async (index) => {
      setImages((prevSelectedFiles) => setSelectedFileLoadingAtIndex(prevSelectedFiles, index, true));
      const res = await upload(images[index]);
      setImages((prevSelectedFiles) => setSelectedFileLoadingAtIndex(prevSelectedFiles, index, false));
      return res;
    };
    const updateVideoUploadStatus = async () => {
      setVideo({...video, loading: true});
      const res = await upload(video);
      setVideo({...video, loading: false});
      return res;
    };
    const setSelectedFileLoadingAtIndex = (prevSelectedFiles, index, bool) => {
      const newSelectedFiles = [...prevSelectedFiles];
      newSelectedFiles[index].loading = bool;
      return newSelectedFiles;
    };
    const upload = async (file) => {
        const blob_signed_id = await uploadFile(file, FileUploadReturnType.BlobSignedId)
        return blob_signed_id
    }
    return { images, video, error, setError, handleAddImages, handleAddVideo, handleRemoveImage, handleRemoveVideo, uploadAllSelectedFiles, uploadVideo }
}