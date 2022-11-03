import { useEffect, useState } from "react";
import { EventRegister } from 'react-native-event-listeners'
import apis from "src/modules/apis";
import { smallBump } from "src/utils/hapticFeedBackUtils";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";
import { useGotoDonationConfirmation } from "./useGoto";


const donationEventId = (postId) => `donation-${postId}`

export default function useDonation({initialDonationSum, postId, benefactorNft}) {
    const [donationSum, setDonatedSum] = useState(initialDonationSum);
    const gotoDonationConfirmation = useGotoDonationConfirmation()
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        setDonatedSum(initialDonationSum);
        const listenerId = EventRegister.addEventListener(donationEventId(postId), (data) => {
            setDonatedSum(data)
        })
        return () => {
            if(typeof listenerId == 'string') EventRegister.removeEventListener(listenerId);
        }
    }, [initialDonationSum]);
    const createDonation = async (value) => {
        const {data} = await promiseFnWithToken({url: apis.donation.postId._(postId).url, method: 'POST'});
        if (data.success) {
            EventRegister.emit(donationEventId(postId), data.donation_sum)
        }
        return data
    }
    const handlePressDonate = () => {
        gotoDonationConfirmation({
            nft: benefactorNft,
            onConfirm: createDonation,
            postId,
        })
      };
    return {donationSum, handlePressDonate};
};