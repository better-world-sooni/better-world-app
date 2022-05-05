import { useEffect, useState } from "react";

export default function useLike(initialLiked, initialLikesCount) {
    const [liked, setLiked] = useState(initialLiked);
    const likeOffset = initialLiked == liked ? 0 : !liked ? -1 : 1;
    const likesCount = initialLikesCount + likeOffset;
    useEffect(() => {
        setLiked(initialLiked);
    }, [initialLiked]);
    return [liked, likesCount, setLiked];
};