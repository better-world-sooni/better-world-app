import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import {chain} from 'lodash';
  
export type OrderOption = {
	name: string;
	id: number;
	merchandise_id: number;
	category: string;
	selected: boolean;
};
export type SelectableOrderCategory = {
	name: string;
	selectedOption: OrderOption
	options: OrderOption[];
};

export default function useUploadOrder({merchandise}){
	const getOrderCategories = orderOptions => {
		return chain(orderOptions)
		  .groupBy('category')
		  .map((value, key) => {
			const options = value.map((item) => ({...item, selected: false }))
			return {name: key, selectedOption: null, options} 
		  })
		  .value();
	  };
	  const orderable = merchandise.is_airdrop_only
	  ? merchandise.coupon?.discount_percent == 100
	  : true;
    const [loading, setLoading] = useState(false);
	const [error, setError] = useState('')
	const [orderOptions, setOrderOptions] = useState(merchandise.order_options ? getOrderCategories(merchandise.order_options) : [])
	const [amount, setAmount] = useState(1);
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
	
    const uploadOrder = async ({uploadSuccessCallback}) => {
		if (loading) {
			return;
		}
		const selectedOptions= {}
		for(const orderCategory of orderOptions){
			if(orderCategory.selectedOption) selectedOptions[orderCategory.selectedOption.category] = orderCategory.selectedOption.id
			else {
				setError('옵션을 선택해 주세요.')
			}
		}
		setLoading(true);
        const body =  {
			paid_price: 0,
			amount,
			coupon_id: merchandise.coupon?.id,
			merchandise_id: merchandise.id,
			order_options: selectedOptions
		}
		const {data} = await postPromiseFnWithToken({url: apis.order._().url, body});
		if (!data.success) {
			setLoading(false);
			return;
		}
        uploadSuccessCallback()
        setLoading(false);
    }

	const handleSelectOption = (categoryIndex, optionIndex) => {
		setError('')
		const newOrderOptions = [...orderOptions]
		const categoryToChange = orderOptions[categoryIndex]
		const changedOptions = categoryToChange.options.map((option, index) => {
			const selected = index == optionIndex
			return {...option, selected}
		})
		const changedSelectedCategory = {...categoryToChange, selectedOption: changedOptions[optionIndex], options: changedOptions}
		newOrderOptions[categoryIndex] = changedSelectedCategory
		setOrderOptions(newOrderOptions)
	}

    return { error, amount, loading, orderable, orderOptions, handleSelectOption, uploadOrder }
}