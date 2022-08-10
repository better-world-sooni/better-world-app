import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';
import {AttendanceCategory} from 'src/hooks/useAttendance';

const AttendanceListScreen = ({
  route: {
    params: {collectionEventId, attendanceCategory},
  },
}) => {
  const {
    data: attendanceListRes,
    isLoading: attendanceListLoading,
    isPaginating: attendanceListPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.attendance.collectionEventId.list);
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (attendanceListPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.attendance.collectionEventId.list(
        collectionEventId,
        attendanceCategory,
        page + 1,
      ),
      'attendances',
    );
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    if (attendanceListLoading) return;
    reloadGetWithToken(
      apis.attendance.collectionEventId.list(
        collectionEventId,
        attendanceCategory,
      ),
    );
  };
  return (
    <PolymorphicOwnerListFlatlist
      onRefresh={handleRefresh}
      data={attendanceListRes?.attendances || []}
      refreshing={attendanceListLoading}
      onEndReached={handleEndReached}
      isPaginating={attendanceListPaginating}
      title={attendanceCategory == AttendanceCategory.Yes ? '참석' : '불참'}
    />
  );
};

export default AttendanceListScreen;
