import {shallowEqual, useSelector} from 'react-redux';
import {Colors} from 'src/modules/styles';
import {RootState} from 'src/redux/rootReducer';

export enum DrawEventStatus {
  IN_PROGRESS = 0,
  ANNOUNCED = 1,
  FINISHED = 2,
}

export enum EventApplicationStatus {
  APPLIED = 0,
  SELECTED = 1,
  RECEIVED = 2,
  IN_PROGRESS = 3,
}

export default function getDrawEventStatus({drawEvent}) {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  if (!drawEvent)
    return {
      orderable: false,
      string: '불러오는중',
      color: Colors.white,
    };
  const drawEventStatus =
    drawEvent.status == DrawEventStatus.FINISHED ||
    (drawEvent.expires_at && new Date(drawEvent.expires_at) < new Date())
      ? {
          orderable: false,
          string: '마감',
          color: Colors.gray[300],
        }
      : drawEvent.nft_collection.contract_address !==
        currentNft.contract_address
      ? {
          orderable: false,
          string: '응모 불가능',
          color: Colors.gray[600],
        }
      : drawEvent.event_application
      ? drawEvent.event_application.status == EventApplicationStatus.APPLIED
        ? {
            orderable: false,
            string: '응모 완료',
            color: Colors.warning.DEFAULT,
          }
        : drawEvent.event_application.status == EventApplicationStatus.SELECTED
        ? {
            orderable: false,
            string: '당첨',
            color: Colors.success.DEFAULT,
          }
        : {
            orderable: false,
            string: '수령 완료',
            color: Colors.gray[600],
          }
      : {
          orderable: true,
          string: '응모 가능',
          color: Colors.info.DEFAULT,
        };
  return drawEventStatus;
}
