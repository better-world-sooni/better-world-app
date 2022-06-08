import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

const followEventId = (url) => `follow-${url}`

export default function useFollow(initialIsFollowing, initialFollowingCount, url) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const followingOffset = initialIsFollowing == isFollowing ? 0 : !isFollowing ? -1 : 1;
    const followerCount = initialFollowingCount + followingOffset;
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
        EventRegister.addEventListener(followEventId(url), (data) => {
            setIsFollowing(data)
        })
        return () => {
            EventRegister.removeEventListener(followEventId(url));
        }
    }, [initialIsFollowing]);
    const handlePressFollowing = () => {
        const method = isFollowing ? 'DELETE' : 'POST';
        promiseFnWithToken({url, method});
        EventRegister.emit(followEventId(url), !isFollowing)
      };
    return [isFollowing, followerCount, handlePressFollowing];
};