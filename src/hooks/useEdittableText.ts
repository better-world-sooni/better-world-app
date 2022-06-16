import { useEffect, useState } from "react";

export default function useEdittableText(initialtext) {
    const [text, setText] = useState(initialtext);
    const textHasChanged = initialtext !== text
    useEffect(() => {
        setText(initialtext);
    }, [initialtext]);
    const handleChangeText= (text) => {
        setText(text);
      };
    return [text, textHasChanged, handleChangeText];
};