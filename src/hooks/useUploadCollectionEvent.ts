import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import useUploadImages from "./useUploadImages";
  
export default function useUploadCollectionEvent(){
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [locationString, setLocationString] = useState('')
	const [locationLink, setLocationLink] = useState('')
	const [holderOnly, setHolderOnly] = useState(true)
	const [startTime, setStartTime] = useState(new Date())
	const [endTime, setEndTime] = useState(new Date())
    const { images, error, setError, handleAddImages, handleRemoveImage, uploadAllSelectedFiles } = useUploadImages({attachedRecord:"collection_event"})
    const postPromiseFnWithToken = usePostPromiseFnWithToken()

    const uploadCollectionEvent = async ({uploadSuccessCallback}) => {
		if (loading) {
			return;
		}
		if (!(title)) {
			setError("제목을 작성해주세요.");
			return;
		}
		if (!(description)) {
			setError("설명을 작성해주세요.");
			return;
		}
		if (!(startTime)) {
			setError("일정 시작 시간을 입력해주세요.");
			return;
		}
		if (!(endTime)) {
			setError("일정 마감 시간을 작성해주세요.");
			return;
		}
		if (!(locationString)) {
			setError("위치를 작성해주세요.");
			return;
		}
		if ((images.length < 1)) {
			setError("이미지를 추가해 주세요.");
			return;
		}
		setLoading(true);
        const body =  {
			title,
			description,
			images: [],
			holder_only: holderOnly,
			start_time: startTime,
			end_time: endTime,
			location_string: locationString,
			location_link: locationLink,
			image_width: null,
			image_height: null
		}
		const signedIdArray = await uploadAllSelectedFiles();
			body.images = signedIdArray
			if (signedIdArray.length > 0) {
				body.image_width = images[0].width
				body.image_height = images[0].height
			}
		const {data} = await postPromiseFnWithToken({url: apis.collectionEvent._().url, body});
		if (!data.success) {
			setError("게시물 업로드중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
        uploadSuccessCallback()
        setLoading(false);
		setError("");
    }

    const handleTitleChange = (text) => {
		setTitle(text);
		setError("");
	};

	const handleDescriptionChange = (text) => {
		setDescription(text);
		setError("");
	};

    return { error, loading, locationString, setLocationString, locationLink, setLocationLink, startTime, setStartTime, endTime, setEndTime, holderOnly, setHolderOnly, title, handleTitleChange, description, handleDescriptionChange, images, handleAddImages, handleRemoveImage, uploadCollectionEvent }
}