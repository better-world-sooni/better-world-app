import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import apis from "src/modules/apis";
import { useDeletePromiseFnWithToken, usePostPromiseFnWithToken, usePromiseFnWithToken } from "src/redux/asyncReducer";

const deleteByUrl = (url) => `delete-${url}`

export default function useDeletePost({postId}){
    const deletePostUrl = apis.post.postId._(postId).url
    const reportPostUrl = apis.report.post.postId(postId).url
    const [loading, setLoading] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const deletePromiseFnWithToken = useDeletePromiseFnWithToken();
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
    useEffect(() => {
        const deleteEventListenerId = EventRegister.addEventListener(deleteByUrl(deletePostUrl), (deleted) => {
            setDeleted(deleted)
        })
        return () => {
            if(typeof deleteEventListenerId == 'string') EventRegister.removeEventListener(deleteEventListenerId);
        }
    }, [deletePostUrl]);
    const deletePost = async () => {
        setLoading(true);
        const {data} = await deletePromiseFnWithToken({
          url: deletePostUrl,
        });
        setLoading(false);
        if (data.success) {
            EventRegister.emit(deleteByUrl(deletePostUrl), true)
        }
    };
    const reportPost = async () => {
      setLoading(true);
          const {data} = await postPromiseFnWithToken({
            url: reportPostUrl,
            body: {content: "신고함"},
          });
          setLoading(false);
          if (data.success) {
            EventRegister.emit(deleteByUrl(deletePostUrl), true)
        }
      };
    return {loading, deleted, deletePost, reportPost}
}