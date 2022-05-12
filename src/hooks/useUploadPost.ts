import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import useUploadImages from "./useUploadImages";

export default function useUploadPost({admin=false, uploadSuccessCallback}){
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('')
    const { images, error, setError, handleAddImages, handleRemoveImage, uploadAllSelectedFiles } = useUploadImages({attachedRecord:"post"})
    const postPromiseFnWithToken = usePostPromiseFnWithToken()

    const uploadPost = async () => {
		if (loading) {
			return;
		}
		if (!(content)) {
			setError("글을 작성해주세요.");
			return;
		}
		setLoading(true);
		const signedIdArray = await uploadAllSelectedFiles();
		console.log(signedIdArray)
        const body =  {
			content,
			images: signedIdArray,
            admin,
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

    return { error, loading, content, handleContentChange, images, handleAddImages, handleRemoveImage, uploadPost }
}