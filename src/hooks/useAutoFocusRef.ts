import { useEffect, useRef } from "react";

export default function useAutoFocusRef(){
    const autoFocusRef = useRef(null);
    useEffect(() => {
        autoFocusRef?.current?.focus();
    }, []);
    return autoFocusRef
}