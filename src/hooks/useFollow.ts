import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

const followEventId = (url) => `follow-${url}`

export default function useFollow(initialIsFollowing, initialFollowingCount, url) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const followingOffset = initialIsFollowing == isFollowing ? 0 : !isFollowing ? -1 : 1;
    const followerCount = Math.max(initialFollowingCount + followingOffset, 0);
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
        const followEventListenerId = EventRegister.addEventListener(followEventId(url), (data) => {
            setIsFollowing(data)
        })
        return () => {
            if(typeof followEventListenerId == 'string')EventRegister.removeEventListener(followEventListenerId);
        }
    }, [initialIsFollowing]);
    const handlePressFollowing = () => {
        const method = isFollowing ? 'DELETE' : 'POST';
        promiseFnWithToken({url, method});
        EventRegister.emit(followEventId(url), !isFollowing)
      };
    return [isFollowing, followerCount, handlePressFollowing];
};