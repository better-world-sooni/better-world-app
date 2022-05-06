import { useEffect, useState } from "react";
import apis from "src/modules/apis";
import { smallBump } from "src/modules/hapticFeedBackUtils";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

export default function useLike(initialLiked, initialLikesCount, url) {
    const [liked, setLiked] = useState(initialLiked);
    const likeOffset = initialLiked == liked ? 0 : !liked ? -1 : 1;
    const likesCount = initialLikesCount + likeOffset;
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        setLiked(initialLiked);
    }, [initialLiked]);
    const handlePressLike = () => {
        setLiked(!liked);
        const method = liked ? 'DELETE' : 'POST';
        if (!liked) smallBump();
        promiseFnWithToken({url, method});
      };
    return [liked, likesCount, handlePressLike];
};