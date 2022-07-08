import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import apis from "src/modules/apis";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

const followEventId = (contractAddress, tokenId?) => tokenId ? `follow-${contractAddress}-${tokenId}` : `follow-${contractAddress}`

export enum FollowCategory {
    NONE = 0,
    FOLLOW = 1,
    BLOCK = 2
}

export default function useFollow(initialIsFollowing, initialFollowingCount, contractAddress, tokenId=null) {
    const [followCategory, setFollowCategory] = useState(initialIsFollowing);
    const isFollowing = followCategory == FollowCategory.FOLLOW
    const isBlocked = followCategory == FollowCategory.BLOCK
    const followingOffset = initialIsFollowing == isFollowing ? 0 : !isFollowing ? -1 : 1;
    const followerCount = Math.max(initialFollowingCount + followingOffset, 0);
    const promiseFnWithToken = usePromiseFnWithToken();
    const url = apis.follow.contractAddressAndTokenId(contractAddress, tokenId).url
    useEffect(() => {
        setFollowCategory(initialIsFollowing);
        const followEventListenerId = EventRegister.addEventListener(followEventId(contractAddress, tokenId), (data) => {
            setFollowCategory(data)
        })
        return () => {
            if(typeof followEventListenerId == 'string') EventRegister.removeEventListener(followEventListenerId);
        }
    }, [initialIsFollowing]);
    const handlePressFollowing = () => {
        const method = isFollowing ? 'DELETE' : 'POST';
        promiseFnWithToken({url, method});
        EventRegister.emit(followEventId(contractAddress, tokenId), !isFollowing)
      };
    return [isFollowing, followerCount, handlePressFollowing, isBlocked];
};