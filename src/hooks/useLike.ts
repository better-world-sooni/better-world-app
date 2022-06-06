import { useEffect, useState } from "react";
import { EventRegister } from 'react-native-event-listeners'
import apis from "src/modules/apis";
import { smallBump } from "src/modules/hapticFeedBackUtils";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

export enum LikableType {
    Comment = "Comment",
    Post = "Post"
}

export default function useLike(initialLiked, initialLikesCount, likableType, likableId) {
    const [liked, setLiked] = useState(initialLiked);
    const likeOffset = initialLiked == liked ? 0 : !liked ? -1 : 1;
    const likesCount = initialLikesCount + likeOffset;
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        const likeEventId = `like-${likableType}-${likableId}`
        EventRegister.addEventListener(likeEventId, (data) => {
            setLiked(data)
        })
        setLiked(initialLiked);
        return () => {
            EventRegister.removeEventListener(likeEventId);
        }
    }, [initialLiked]);
    const handlePressLike = () => {
        const method = liked ? 'DELETE' : 'POST';
        const apiFn = likableType==LikableType.Comment ? apis.like.comment : apis.like.post
        if (!liked) smallBump();
        promiseFnWithToken({url: apiFn(likableId).url, method});
        EventRegister.emit(`like-${likableType}-${likableId}`, !liked)
      };
    return [liked, likesCount, handlePressLike];
};