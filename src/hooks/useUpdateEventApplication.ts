import {useEffect, useState} from 'react';
import apis from 'src/modules/apis';
import {usePatchPromiseFnWithToken} from 'src/redux/asyncReducer';

export default function useUpdateEventApplication({initialEventApplication}) {
  const [eventApplication, setEventApplication] = useState(
    initialEventApplication,
  );
  const [loading, setLoading] = useState(false);
  const patchPromiseFn = usePatchPromiseFnWithToken();
  const updateEventApplicationStatus = async status => {
    if (loading) return;
    setLoading(true);
    const body = {
      status,
    };
    const {data} = await patchPromiseFn({
      url: apis.event_application.eventApplicationId(eventApplication.id).url,
      body,
    });
    if (data) setEventApplication(data.event_application);
    setLoading(false);
  };

  useEffect(() => {
    setEventApplication(initialEventApplication);
  }, [initialEventApplication]);
  return {eventApplication, loading, updateEventApplicationStatus};
}
