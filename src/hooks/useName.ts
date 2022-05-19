import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import apis from "src/modules/apis";
import { getNftName } from "src/modules/nftUtils";
import { appActions } from "src/redux/appReducer";
import { usePutPromiseFnWithToken, useReloadGETWithToken } from "src/redux/asyncReducer";
import useEdittableText from "./useEdittableText";

export enum NameOwnerType {
    Nft,
    NftCollection
}
export default function useName(nameOwner, nameOwnerType) {
    const [name, nameHasChanged, handleChangeText] = useEdittableText(NameOwnerType.Nft == nameOwnerType ? getNftName(nameOwner) : nameOwner.name);
    const [nameError, setNameError] = useState('')
    const [nameLoading, setNameLoading] = useState(false)
    const reloadGetWithToken = useReloadGETWithToken();
    const putPromiseFnWithToken = usePutPromiseFnWithToken();
    const dispatch = useDispatch()
    const handleSaveName = async () => {
        if (!nameError) {
            setNameLoading(true)
			try {
				const key = nameOwnerType == NameOwnerType.NftCollection ? apis.nft_collection.contractAddress.profile(nameOwner.contract_address) : apis.nft._();
                const url = nameOwnerType == NameOwnerType.NftCollection ? apis.nft_collection.contractAddress._(nameOwner.contract_address).url : apis.nft._().url;
                const body = {
					property: "name",
					value: name,
				}
				const {data} = await putPromiseFnWithToken({
                    url,
                    body
                });
				if (data?.success) {
                    setNameError('')
                    setNameLoading(false)
                    console.log(data)
                    await reloadGetWithToken(key);
                    if(nameOwnerType == NameOwnerType.Nft){ 
                        await reloadGetWithToken(apis.nft.contractAddressAndTokenId(nameOwner.contract_address, nameOwner.token_id));
                        await dispatch(appActions.updateCurrentNftName({
                            name
                         }));
                    }
					return;
				}
                setNameLoading(false)
				throw new Error();
			} catch {
				setNameError("입력하신 이름으로 업데이트 하지 못하였습니다." );
                setNameLoading(false)
			}
		}
        
    }
    const handleChangeName = (text) => {
        const error = getNameError(text);
        setNameError(error)
        handleChangeText(text)
    }
    const getNameError = (value) => {
		if (value == "") {
			return "이름은 한 글자 이상이어야 합니다.";
		}
		if (value.split(" ").length > 5) {
			return "이름은 다섯 단어 이하여야 합니다.";
		}
		if (value.length > 20) {
			return "이름은 길이는 스무 글자 이하여야 합니다.";
		}
		return "";
	};

    return {name, nameHasChanged, nameLoading, nameError, handleChangeName, handleSaveName};
};