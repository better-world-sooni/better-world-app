import { useEffect, useState } from "react";
import { EventRegister } from 'react-native-event-listeners'
import apis from "src/modules/apis";
import { smallBump } from "src/utils/hapticFeedBackUtils";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

export enum LikableType {
    Comment = "Comment",
    Post = "Post"
}

const likeEventId = (likableType, likableId) => `like-${likableType}-${likableId}`

export default function useLike(initialLiked, initialLikesCount, likableType, likableId) {
    const [liked, setLiked] = useState(initialLiked);
    const likeOffset = initialLiked == liked ? 0 : !liked ? -1 : 1;
    const likesCount = initialLikesCount + likeOffset;
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        setLiked(initialLiked);
        EventRegister.addEventListener(likeEventId(likableType, likableId), (data) => {
            setLiked(data)
        })
        return () => {
            EventRegister.removeEventListener(likeEventId(likableType, likableId));
        }
    }, [initialLiked]);
    const handlePressLike = () => {
        const method = liked ? 'DELETE' : 'POST';
        const apiFn = likableType==LikableType.Comment ? apis.like.comment : apis.like.post
        if (!liked) smallBump();
        promiseFnWithToken({url: apiFn(likableId).url, method});
        EventRegister.emit(likeEventId(likableType, likableId), !liked)
      };
    return [liked, likesCount, handlePressLike];
};