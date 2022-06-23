import { useState } from "react";
import { useDispatch } from "react-redux";
import apis from "src/modules/apis";
import { getNftStory } from "src/utils/nftUtils";
import { appActions } from "src/redux/appReducer";
import { usePutPromiseFnWithToken, useReloadGETWithToken } from "src/redux/asyncReducer";
import useEdittableText from "./useEdittableText";

export enum StoryOwnerType {
    Nft,
    NftCollection
}
export default function useStory(storyOwner, storyOwnerType) {
    const [story, storyHasChanged, handleChangeText] = useEdittableText(StoryOwnerType.Nft == storyOwnerType ? getNftStory(storyOwner) : storyOwner.about);
    const [storyError, setStoryError] = useState('')
    const [storyLoading, setStoryLoading] = useState(false)
    const reloadGetWithToken = useReloadGETWithToken();
    const putPromiseFnWithToken = usePutPromiseFnWithToken();
    const dispatch = useDispatch()
    const handleSaveStory = async () => {
        if (!storyError) {
            setStoryLoading(true)
			try {
				const key = storyOwnerType == StoryOwnerType.NftCollection ? apis.nft_collection.contractAddress._(storyOwner.contract_address) : apis.nft._();
                const url = key.url
                const body = {
					property: "story",
					value: story,
				}
				const {data} = await putPromiseFnWithToken({
                    url,
                    body
                });
				if (data?.success) {
                    setStoryError('')
                    setStoryLoading(false)
                    await reloadGetWithToken(key);
                    if(storyOwnerType == StoryOwnerType.Nft){ 
                        await reloadGetWithToken(apis.nft.contractAddressAndTokenId(storyOwner.contract_address, storyOwner.token_id));
                        await dispatch(appActions.updateCurrentNftStory({
                            story
                         }));
                    }
					return;
				}
                setStoryLoading(false)
				throw new Error();
			} catch {
				setStoryError("입력하신 이름으로 업데이트 하지 못하였습니다." );
                setStoryLoading(false)
			}
		}
        
    }
    const handleChangeStory = (text) => {
        const error = getStoryError(text);
        setStoryError(error)
        handleChangeText(text)
    }
    const getStoryError = (value) => {
		if (new Blob([value]).size > 60000) {
			return "스토리는 60KB 이하여야합니다.";
		}
		return "";
	};

    return {story, storyHasChanged, storyLoading, storyError, handleChangeStory, handleSaveStory};
};