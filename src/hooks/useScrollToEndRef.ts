import { useEffect, useRef } from "react";

export default function useScrollToEndRef(){
    const scrollToEndRef = useRef(null);
    useEffect(() => {
        scrollToEndRef?.current?.scrollToEnd();
    }, [scrollToEndRef?.current?.scrollToEnd]);
    return scrollToEndRef
}