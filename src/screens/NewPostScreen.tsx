import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, MoreHorizontal} from 'react-native-feather';
import apis from 'src/modules/apis';
import {Img} from 'src/components/common/Img';
import {useNavigation} from '@react-navigation/native';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Span} from 'src/components/common/Span';
import {createdAtText} from 'src/modules/timeUtils';
import useUploadPost from 'src/hooks/useUploadPost';
import UploadImageSlideShow from 'src/components/common/UploadImageSlideShow';
import {TextInput} from 'src/modules/viewComponents';
import {useReloadGETWithToken} from 'src/redux/asyncReducer';
import {useGotoProfile} from 'src/hooks/useGoto';
import {ActivityIndicator} from 'react-native';

const NewPostScreen = ({}) => {
  const {goBack} = useNavigation();
  const reloadGetWithToken = useReloadGETWithToken();
  const goToProfile = useGotoProfile();
  const uploadSuccessCallback = () => {
    reloadGetWithToken(apis.nft._());
    goToProfile();
  };
  const {
    error,
    loading,
    content,
    handleContentChange,
    images,
    handleAddImages,
    handleRemoveImage,
    uploadPost,
  } = useUploadPost({uploadSuccessCallback: uploadSuccessCallback});
  const {currentNft} = useSelector(
    (root: RootState) => ({currentNft: root.app.session.currentNft}),
    shallowEqual,
  );
  return (
    <Div flex bgWhite relative>
      <Div w={'100%'} zIndex={100} h170>
        <Div h={HAS_NOTCH ? 44 : 20} />
        <Row pl={10} pr15 itemsCenter py8>
          <Col auto mr5 onPress={goBack}>
            <ChevronLeft width={20} height={20} color="black" strokeWidth={3} />
          </Col>
          <Col auto mr10>
            <Img
              w35
              h35
              rounded100
              uri={getNftProfileImage(currentNft, 50, 50)}
            />
          </Col>
          <Col auto>
            <Span fontSize={15} medium>
              {getNftName(currentNft)}
            </Span>
            <Span fontSize={12} mt2 gray600>
              {createdAtText(new Date())}
            </Span>
          </Col>
          <Col />
          <Col auto onPress={uploadPost}>
            {loading ? (
              <ActivityIndicator></ActivityIndicator>
            ) : (
              <Span info bold fontSize={16}>
                공유
              </Span>
            )}
          </Col>
        </Row>
        <Div>
          <UploadImageSlideShow
            images={[...images, {uri: null}]}
            onPressAdd={handleAddImages}
            onPressRemove={handleRemoveImage}
          />
        </Div>
        {error ? (
          <Div px15 mt10>
            <Span notice danger>
              {error}
            </Span>
          </Div>
        ) : null}
        <Div px15 py10>
          <TextInput
            value={content}
            placeholder={'마크다운을 사용하실 수 있습니다.'}
            fontSize={16}
            multiline
            bold
            onChangeText={handleContentChange}></TextInput>
        </Div>
      </Div>
    </Div>
  );
};

export default NewPostScreen;
