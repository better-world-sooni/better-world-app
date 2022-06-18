import { useState } from "react";
import apis from "src/modules/apis";
import { isAddress } from "src/modules/blockchainUtils";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import useUploadImageUriKey from "./useUploadImageUriKey";
  
export default function useCreateCommunityWallet(){
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [about, setAbout] = useState('')
	const [error, setError] = useState('')
	const { image, imageHasChanged, uploading, handleAddImage, handleRemoveImage, getImageUriKey } = useUploadImageUriKey({attachedRecord:"community_wallet", uri: ''})
    const postPromiseFnWithToken = usePostPromiseFnWithToken()

    const createCommunityWallet = async ({uploadSuccessCallback}) => {
		if (loading) {
			return;
		}
		if (!(name)) {
			setError("지갑 이름을 작성해주세요.");
			return;
		}
		if (!(address)) {
			setError("지갑 주소를 작성해주세요.");
			return;
		}
		if ((!image)) {
			setError("이미지를 추가해 주세요.");
			return;
		}
		setLoading(true);
		const imageUriKey = await getImageUriKey();
        const body =  {
			name,
			address,
			about,
			image_uri_key: imageUriKey,
		}
		const {data} = await postPromiseFnWithToken({url: apis.community_wallet._().url, body});
		if (!data.success) {
			setError("게시물 업로드중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
        uploadSuccessCallback()
        setLoading(false);
		setError("");
    }
    const handleNameChange = (text) => {
		setName(text);
		setError("");
	};

	const handleAboutChange = (text) => {
		setAbout(text);
		setError("");
	};

	const handleAddressChange = (text) => {
		setAddress(text);
		setError(isAddress(text) ? "" : "주소가 유효하지 않습니다.");
	};

    return { error, loading, name, handleNameChange, about, handleAboutChange, address, handleAddressChange, image, handleAddImage, handleRemoveImage, uploading, createCommunityWallet }
}