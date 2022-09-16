import { shallowEqual, useSelector } from "react-redux";
import { Colors } from "src/modules/styles"
import { RootState } from "src/redux/rootReducer";

export enum DrawEventStatus {
    IN_PROGRESS = 0, 
    ANNOUNCED = 1,
    FINISHED = 2
}

export enum EventApplicationStatus {
    APPLIED = 0,
    SELECTED = 1,
    RECEIVED = 2
}

export default function useDrawEventStatus({drawEvent}){
    const {currentNft} = useSelector(
        (root: RootState) => root.app.session,
        shallowEqual,
      );
    if (!drawEvent) return {
        orderable: false,
        string: "불러오는중",
        color: Colors.white
    }
    const drawEventStatus = drawEvent.nft_collection.contract_address !== currentNft.contract_address ? {
        orderable: false,
        string: "응모 불가능",
        color: Colors.gray[400]
    } :
    drawEvent.status == DrawEventStatus.IN_PROGRESS ? ( drawEvent.expires_at && new Date(drawEvent.expires_at) < new Date() ? {
        orderable: false,
        string: "마감",
        color: Colors.gray[400]
    } : drawEvent.event_application ? {
        orderable: false,
        string: "응모 완료",
        color: Colors.info.DEFAULT
    } : {
        orderable: true,
        string: "진행 중",
        color: Colors.black
    }) : drawEvent.status == DrawEventStatus.FINISHED ? {
        orderable: false,
        string: "마감",
        color: Colors.gray[400]
    } : drawEvent.event_application ? (drawEvent.event_application.status == EventApplicationStatus.APPLIED ? {
        orderable: false,
        string: "응모 완료",
        color: Colors.info.DEFAULT
    } : drawEvent.event_application.status == EventApplicationStatus.SELECTED ? {
        orderable: false,
        string: "당첨됨",
        color: Colors.success.DEFAULT
    } : {
        orderable: false,
        string: "수령 완료",
        color: Colors.gray[400]
    } ) : {
        orderable: false,
        string: "당첨 발표",
        color: Colors.info.DEFAULT
    } 
    return drawEventStatus
}