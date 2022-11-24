import {useState} from 'react';
import apis from 'src/modules/apis';
import {
  useDeletePromiseFnWithToken,
  usePatchPromiseFnWithToken,
} from 'src/redux/asyncReducer';

export default function useUpdateDrawEvent({initialDrawEvent}) {
  const [drawEvent, setDrawEvent] = useState(initialDrawEvent);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const patchPromiseFn = usePatchPromiseFnWithToken();
  const deletePromiseFn = useDeletePromiseFnWithToken();
  const updateDrawEventStatus = async status => {
    if (loading) return;
    setLoading(true);
    const body = {
      status,
    };
    const {data} = await patchPromiseFn({
      url: apis.draw_event.drawEventId._(drawEvent.id).url,
      body,
    });
    if (data) setDrawEvent(data.draw_event);
    setLoading(false);
  };
  const deleteDrawEvent = async () => {
    if (loading) return;
    setLoading(true);
    const {data} = await deletePromiseFn({
      url: apis.draw_event.drawEventId._(drawEvent.id).url,
    });
    if (data) setDeleted(true);
    setLoading(false);
  };
  return {drawEvent, loading, deleted, deleteDrawEvent, updateDrawEventStatus};
}
