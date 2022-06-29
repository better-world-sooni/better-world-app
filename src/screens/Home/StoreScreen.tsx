import {useFocusEffect} from '@react-navigation/core';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
  useMemo,
} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {Img} from 'src/components/common/Img';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  asyncActions,
  getKeyByApi,
} from 'src/redux/asyncReducer';
import {appActions} from 'src/redux/appReducer';
import {RootState} from 'src/redux/rootReducer';
import {cable} from 'src/modules/cable';
import {ChatChannel} from 'src/components/ChatChannel';
import TruncatedText from 'src/components/common/TruncatedText';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {createdAtText} from 'src/utils/timeUtils';
import {useGotoChatRoomFromList} from 'src/hooks/useGoto';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {resizeImageUri} from 'src/utils/uriUtils';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {FlatList} from 'react-native';

function StoreScreen() {
    return (
        <Span>
            {"hj"}
        </Span>
    )
}
export default StoreScreen