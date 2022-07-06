import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import { useGotoMerchandiseSelect } from "./useGoto";
  
export default function useUploadCoupon({uploadSuccessCallback}){
	
    const [loading, setLoading] = useState(false);
	const [label, setLabel] = useState('')
	const [error, setError] = useState('')
	const [discountPercent, setDiscountPercent] = useState(100)
	const [merchandiseId, setMerchandiseId] = useState(null)
	const [expiresAt, setExpiresAt] = useState(null)
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
	const selectMerchandise = (merchandise) => setMerchandiseId(merchandise.id)
	const handlePressMerchandiseId = useGotoMerchandiseSelect({ onConfirm: selectMerchandise })

    const uploadCoupon = async () => {
		if (loading) {
			return;
		}
		if (!(label)) {
			setError("레이블을 작성해주세요.");
			return;
		}
		if (!(merchandiseId)) {
			setError("상품을 선택해주세요.");
			return;
		}
		setLoading(true);
        const body =  {
			label,
			expires_at: expiresAt,
			discount_percent: discountPercent,
			merchandise_id: merchandiseId
		}
		const {data} = await postPromiseFnWithToken({url: apis.coupon.list().url, body});
		if (!data?.success) {
			setError("쿠폰 뿌리기 중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
        uploadSuccessCallback()
        setLoading(false);
    }

	const handleLabelChange = (text) => {
		setLabel(text);
		setError("");
	};


    return { error, loading, expiresAt, setExpiresAt, label, handleLabelChange, merchandiseId, handlePressMerchandiseId, uploadCoupon }
}