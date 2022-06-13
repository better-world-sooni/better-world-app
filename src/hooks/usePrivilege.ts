import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import apis from "src/modules/apis";
import { usePutPromiseFnWithToken } from "src/redux/asyncReducer";

const privilegeEventId = (contractAddress, tokenId) => `privilege-${contractAddress}-${tokenId}`

export default function usePrivilege(nft) {
    const [privilege, setPrivilege] = useState(nft.privilege);
    const putPromiseFnWithToken = usePutPromiseFnWithToken();
    const eventId = privilegeEventId(nft.contract_address, nft.token_id)
    useEffect(() => {
        setPrivilege(nft.privilege);
        EventRegister.addEventListener(eventId, (data) => {
            setPrivilege(data)
        })
        return () => {
            EventRegister.removeEventListener(eventId);
        }
    }, [nft.privilege]);
    const handlePressPrivilege = (value) => {
        putPromiseFnWithToken({
            url: apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id).url, 
            body: {
            property: 'privilege',
            value
        }});
        EventRegister.emit(eventId, value)
      };
    return {privilege, handlePressPrivilege};
};