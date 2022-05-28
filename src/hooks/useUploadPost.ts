import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import useUploadImages from "./useUploadImages";
  
export default function useUploadPost({initialPostType = ''}){
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('')
	const [currentPostType, setPostType] = useState(initialPostType)
	const [votingDeadline, setVotingDeadline] = useState(null)
	const [addImages, setAddImages] = useState(false)
    const { images, error, setError, handleAddImages, handleRemoveImage, uploadAllSelectedFiles } = useUploadImages({attachedRecord:"post"})
    const postPromiseFnWithToken = usePostPromiseFnWithToken()

    const uploadPost = async ({admin, uploadSuccessCallback, repostId = null}) => {
		if (loading) {
			return;
		}
		if (!(content)) {
			setError("글을 작성해주세요.");
			return;
		}
		setLoading(true);
        const body =  {
			content,
			images: [],
            admin,
			type: currentPostType || null,
			voting_deadline: votingDeadline,
			image_width: null,
			image_height: null,
			repost_id: repostId
		}
		if(addImages){
			const signedIdArray = await uploadAllSelectedFiles();
			body.images = signedIdArray
			if (signedIdArray.length > 0) {
				body.image_width = images[0].width
				body.image_height = images[0].height
			}
		}
		const {data} = await postPromiseFnWithToken({url: apis.post._().url, body});
		if (!data.success) {
			setError("게시물 업로드중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
        uploadSuccessCallback()
        setLoading(false);
		setError("");
    }

    const handleContentChange = (text) => {
		setContent(text);
		setError("");
	};

    return { error, loading, addImages, setAddImages, currentPostType, setPostType, votingDeadline, setVotingDeadline, content, handleContentChange, images, handleAddImages, handleRemoveImage, uploadPost }
}