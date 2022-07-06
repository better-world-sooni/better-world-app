import { useState } from "react";
import apis from "src/modules/apis";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import useUploadImages from "./useUploadImages";

export type OrderCategory = {
	name: string
	options: string[]
}
  
export default function useUploadMerchandise(){
	
    const [loading, setLoading] = useState(false);
	const [name, setName] = useState('')
    const [description, setDescription] = useState('')
	const [expiresAt, setExpiresAt] = useState(null)
	const [isDeliverable, setIsDeliverable] = useState(false)
	const [isAirdropOnly, setIsAirdropOnly] = useState(true)
	const [orderCategories, setOrderCategories] = useState<OrderCategory[]>([])
	const [price, setPrice]= useState(0)
	const [maxPerAmountPerOrder, setMaxAmountPerOrder] = useState(1);
    const { images, error, setError, handleAddImages, handleRemoveImage, uploadAllSelectedFiles } = useUploadImages({attachedRecord:"merchandise", fileLimit: 8})
    const postPromiseFnWithToken = usePostPromiseFnWithToken()
	const maxPerAmountPerOrderPickerOptions = [
		{id: 'maxPerAmountPerOrder', label: '개', min: 1, max: isAirdropOnly ? 1 : 127},
	];

    const uploadMerchandise = async ({uploadSuccessCallback}) => {
		if (loading) {
			return;
		}
		if (!(name)) {
			setError("이름을 작성해주세요.");
			return;
		}
		if (!(description)) {
			setError("설명을 작성해주세요.");
			return;
		}
		if (!(price)) {
			setError("가격을 추가해주세요.");
			return;
		}
		if(images.length == 0){
			setError("이미지를 추가해주세요.");
			return;
		}
		setLoading(true);
		const signedIdArray = await uploadAllSelectedFiles();
		const orderOptions = orderCategories.map((orderCategory) => {
			return orderCategory.options.map((orderOption) => {
				return {
					name: orderOption,
					category: orderCategory.name
				}
			})
		}).flat()
        const body =  {
			name,
			description,
			price,
			images: signedIdArray,
			expires_at: expiresAt,
			is_deliverable: isDeliverable,
			is_airdrop_only: isAirdropOnly,
			order_options_attributes: orderOptions,
			max_amount_per_order: maxPerAmountPerOrder,
		}
		const {data} = await postPromiseFnWithToken({url: apis.merchandise._().url, body});
		if (!data?.success) {
			setError("상품 업로드중 문제가 발생하였습니다.");
			setLoading(false);
			return;
		}
        uploadSuccessCallback()
        setLoading(false);
		setError("");
    }

    const handleDescriptionChange = (text) => {
		setDescription(text);
		setError("");
	};

	const handleNameChange = (text) => {
		setName(text);
		setError("");
	};
	const handlePriceChange = (number) => {
		setPrice(number);
		setError("");
	};

	const handleAddOrderCategory = (name) => {
		setOrderCategories([...orderCategories, {name, options: []}])
	}

	const handleRemoveOrderCategory = (index) => {
		const newOrderCategories = orderCategories.slice(0, index).concat(orderCategories.slice(index+1))
		setOrderCategories(newOrderCategories)
	}

	const handleAddOrderOption = (categoryIndex, optionName) => {
		const newOrderCategories = [...orderCategories]
		if(newOrderCategories[categoryIndex]){
			newOrderCategories[categoryIndex].options = [...newOrderCategories[categoryIndex].options, optionName]
			setOrderCategories(newOrderCategories)
		}
	}

	const handleRemoveOrderOption = (categoryIndex, optionIndex) => {
		const newOrderCategories = [...orderCategories]
		if(newOrderCategories[categoryIndex]){
			newOrderCategories[categoryIndex].options = newOrderCategories[categoryIndex].options.slice(0, optionIndex).concat(newOrderCategories[categoryIndex].options.slice(optionIndex+1))
			setOrderCategories(newOrderCategories)
		}
	}

    return { error, loading, maxPerAmountPerOrderPickerOptions, maxPerAmountPerOrder, setMaxAmountPerOrder, orderCategories, handleAddOrderCategory, handleRemoveOrderCategory, handleAddOrderOption, handleRemoveOrderOption, price, handlePriceChange, expiresAt, setExpiresAt, name, handleNameChange, isDeliverable, setIsDeliverable, isAirdropOnly, setIsAirdropOnly, description, handleDescriptionChange, images, handleAddImages, handleRemoveImage, uploadMerchandise }
}