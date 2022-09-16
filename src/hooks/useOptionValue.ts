import { useState } from "react";
import { Linking } from "react-native";
import useEdittableText from "./useEdittableText";

export default function useOptionValue() {
    const [text, textdHasChanged, handleChangeTextValue] = useEdittableText("");
    const [textError, setTextError] = useState('')
    const isTextSavable = textdHasChanged && !textError

    const isError = value => {
        if (value==="") return true
        else return false
    }
    
    const handleChangeText = (text) => {
        const error = getNameError(text);
        setTextError(error)
        handleChangeTextValue(text)
    }
    const getNameError = (value) => {
		if (isError(value)) {
			return "입력란이 비어있습니다.";
		}
		return "";
	};

    return {text, textdHasChanged, textError, isTextSavable, handleChangeText, isError};
};