import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import useUploadImages from "./useUploadImages";
  
export default function useUploadPost(){
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('')
	const [currentPostType, setPostType] = useState('')
	const [votingDeadline, setVotingDeadline] = useState(null)
    const { images, error, setError, handleAddImages, handleRemoveImage, uploadAllSelectedFiles } = useUploadImages({attachedRecord:"post"})
    const postPromiseFnWithToken = usePostPromiseFnWithToken()

    const uploadPost = async ({admin, uploadSuccessCallback}) => {
		if (loading) {
			return;
		}
		if (!(content)) {
			setError("글을 작성해주세요.");
			return;
		}
		setLoading(true);
		const signedIdArray = await uploadAllSelectedFiles();
        const body =  {
			content,
			images: signedIdArray,
            admin,
			type: currentPostType || null,
			voting_deadline: votingDeadline
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

    return { error, loading, currentPostType, setPostType, votingDeadline, setVotingDeadline, content, handleContentChange, images, handleAddImages, handleRemoveImage, uploadPost }
}