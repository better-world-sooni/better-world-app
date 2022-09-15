import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import {chain} from 'lodash';
import useDrawEventStatus from "./useDrawEventStatus";
import { EventApplicationInputType } from "src/components/NewEventApplicationOptions";
  
export type OrderOption = {
	name: string;
	id: number;
	merchandise_id: number;
	category: string;
	selected: boolean;
};
export type SelectableOrderCategory = {
	name: string;
	drawEventId:EventApplicationInputType
	selectedOption: OrderOption
	options: OrderOption[];
};

export default function useUploadEventApplication({drawEvent, uploadSuccessCallback}){
	const getOrderCategories = orderOptions => {
		return chain(orderOptions)
		  .groupBy('category')
		  .map((value, key) => {
			const options = value.map((item) => ({...item, selected: false }))
			if (options.length==1 && options[0].input_type==EventApplicationInputType.CUSTOM_INPUT) return {name: key, drawEventId:EventApplicationInputType.CUSTOM_INPUT, selectedOption: null, options} 
			if (options.length==1 && options[0].input_type==EventApplicationInputType.DISCORD_ID) return {name: key, drawEventId:EventApplicationInputType.DISCORD_ID, selectedOption: null, options} 
			if (options.length==1 && options[0].input_type==EventApplicationInputType.TWITTER_ID) return {name: key, drawEventId:EventApplicationInputType.TWITTER_ID, selectedOption: null, options} 
			return {name: key, drawEventId:EventApplicationInputType.SELECT, selectedOption: null, options} 
		  })
		  .value();
	  };
	  const orderable = true;
    const [loading, setLoading] = useState(false);
	const [error, setError] = useState('')
	const [orderOptions, setOrderOptions] = useState(drawEvent.draw_event_options ? getOrderCategories(drawEvent.draw_event_options) : [])
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
	const drawEventStatus = useDrawEventStatus({drawEvent})
	
    const uploadEventApplication = async () => {
		if (loading) {
			return;
		}
		if(!orderable){
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
			draw_event_id: drawEvent.id,
			draw_event_options: selectedOptions
		}
		const {data} = await postPromiseFnWithToken({url: apis.event_application._().url, body});
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

    return { error, loading, drawEventStatus, orderOptions, handleSelectOption, uploadEventApplication }
}