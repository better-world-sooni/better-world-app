import { Colors } from "src/modules/styles"

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
    if (!drawEvent) return {
        orderable: false,
        string: "불러오는중",
        color: Colors.white
    }
    const drawEventStatus = drawEvent.status == DrawEventStatus.IN_PROGRESS ? ( drawEvent.expires_at && new Date(drawEvent.expires_at) < new Date() ? {
        orderable: false,
        string: "마감",
        color: Colors.gray[400]
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