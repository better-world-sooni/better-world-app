import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { useDeletePromiseFnWithToken } from "src/redux/asyncReducer";

const deleteByUrl = (url) => `delete-${url}`

export default function useDelete({url}){
    const [loading, setLoading] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
    useEffect(() => {
        const deleteEventListenerId = EventRegister.addEventListener(deleteByUrl(url), (deleted) => {
            setDeleted(deleted)
        })
        return () => {
            if(typeof deleteEventListenerId == 'string') EventRegister.removeEventListener(deleteEventListenerId);
        }
    }, [url]);
    const deleteObject = async () => {
        setLoading(true);
        const {data} = await deletePromiseFnWithToken({
          url,
        });
        setLoading(false);
        if (data.success) {
            EventRegister.emit(deleteByUrl(url), true)
        }
    };
    return {loading, deleted, deleteObject}
}