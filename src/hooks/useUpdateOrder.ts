import { useState } from "react";
import apis from "src/modules/apis";
import { usePatchPromiseFnWithToken } from "src/redux/asyncReducer";

export default function useUpdateOrder({initialOrder}){
    const [order, setOrder] = useState(initialOrder);
    const [loading, setLoading] = useState(false)
    const patchPromiseFn = usePatchPromiseFnWithToken()
    const updateOrderStatus = async (status) => {
        if(loading) return;
        setLoading(true)
        const body = {
            status
        }
        const {data} = await patchPromiseFn({url: apis.order.orderId(order.id).url, body})
        if(data) setOrder(data.order)
        setLoading(false)
    }
    return {order, loading, updateOrderStatus}
}