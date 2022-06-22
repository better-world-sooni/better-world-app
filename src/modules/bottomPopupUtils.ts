import { EventRegister } from "react-native-event-listeners";
import { largeBump, smallBump } from "./hapticFeedBackUtils";

export const infoBottomPopupEvent = () => `info-bottom-popup`;
export const nftListEvent = () => `nft-list`;

export const openInfoPopup = (text, bump?) => {
    if(bump) smallBump();
    EventRegister.emit(infoBottomPopupEvent(), text);
};

export const openNftList = () => {
    largeBump();
    EventRegister.emit(nftListEvent());
};

export const handlePressContribution = () => {
    openInfoPopup('인분 기여도는 BetterWorld 사용자로부터 받은 팔로우, 투표, 좋아요, 허그 등을 종합해서 만든 기여도 지표에요.');
};

export const handlePressAffinity = () => {
    openInfoPopup('멤버 친목도는 컬렉션 멤버끼리의 팔로우를 세어 추산하는 척도입니다.');
};

