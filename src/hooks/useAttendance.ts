import { useEffect, useState } from "react";
import apis from "src/modules/apis";
import { smallBump } from "src/modules/hapticFeedBackUtils";
import { useDeletePromiseFnWithToken, usePostPromiseFnWithToken, usePutPromiseFnWithToken } from "src/redux/asyncReducer";

export enum AttendanceCategory {
    Yes = 1,
    Maybe = 2,
}
export default function useAttendance({initialAttendance, initialWillAttendCount, initialMaybeAttendCount, collectionEventId}) {
    const [attendance, setAttendance] = useState(initialAttendance)
    const willAttend = AttendanceCategory.Yes == attendance 
    const maybeAttend = AttendanceCategory.Maybe == attendance
    const noChange = initialAttendance == attendance
    const willAttendCountOffset = noChange ? 0 : willAttend ? 1 : (AttendanceCategory.Yes == initialAttendance ? -1 : 0);
    const maybeAttendCountOffset = noChange ? 0 : maybeAttend ? 1 : (AttendanceCategory.Maybe == initialAttendance ? -1 : 0);
    
    const putPromiseFnWithToken = usePutPromiseFnWithToken();
    const deletePromiseFnWithToken = useDeletePromiseFnWithToken()
    useEffect(() => {
        setAttendance(initialAttendance);
    }, [initialAttendance]);
    const handlePressWillAttend = () => {
        if(willAttend){
            handlePressCancelAttend()
            return;
        }
        handlePressVote(AttendanceCategory.Yes)
    };
    const handlePressMaybeAttend= () => {
        if(maybeAttend){
            handlePressCancelAttend()
            return;
        }
        handlePressVote(AttendanceCategory.Maybe)
    };
    const handlePressCancelAttend= () => {
        deletePromiseFnWithToken({url: apis.attendance.collectionEventId._(collectionEventId).url});
        setAttendance(null);
    };
    const handlePressVote = (attendanceCategory) => {
        smallBump();
        putPromiseFnWithToken({url: apis.attendance.collectionEventId._(collectionEventId).url, body: {
            category: attendanceCategory
        }});
        setAttendance(attendanceCategory);
    }
    return {
        willAttendCount: initialWillAttendCount + willAttendCountOffset, 
        maybeAttendCount: initialMaybeAttendCount + maybeAttendCountOffset, 
        willAttend,
        maybeAttend,
        handlePressWillAttend,
        handlePressMaybeAttend
    }
};