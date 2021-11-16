import React, { useCallback } from 'react';
import {Modal} from 'react-native';
import {
  characterDesc,
  GO_COLOR,
  GRAY_COLOR,
  Validity,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {ScrollView} from 'src/modules/viewComponents';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';

const characterKeys = Object.keys(IMAGES.characters)

const Character = ({characterKey, currentCharacter, setCharacter}) => {
  const borderProp = useCallback(bool => {
    if (!bool || bool === Validity.NULL || bool === Validity.ZERO) {
      return {
        borderColor: GRAY_COLOR,
        borderWidth: 1,
      };
    } else if (bool === Validity.INVALID) {
      return {
        borderColor: 'red',
        borderWidth: 1,
      };
    } else {
      return {
        borderColor: 'black',
        borderWidth: 1,
      };
    }
  }, []);
  return (
    <Div flexBasis={'50%'}>
      <Div
        rounded5
        m5
        p5
        {...borderProp(characterKey == currentCharacter ? true : null)}>
        <Row onPress={() => setCharacter(characterKey)}>
          <Col>
            <Img source={IMAGES.characters[characterKey]} w100 h100></Img>
          </Col>
          <Col justifyCenter itemsCenter px10>
            {characterDesc.get(characterKey).span}
          </Col>
        </Row>
      </Div>
    </Div>
  );
};

const AvatarSelect = ({visible, onPressReturn, character, setCharacter}) => {
  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      presentationStyle="pageSheet">
      <Div>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Row py20 justifyCenter itemsCenter>
            <Col />
            <Col itemsCenter>
              <Span bold fontSize={20}>
                아바타 선택
              </Span>
            </Col>
            <Col itemsEnd onPress={onPressReturn}>
              <Span px20 color={GO_COLOR}>
                완료
              </Span>
            </Col>
          </Row>
          <Div flexDirection={'row'} flexWrap={'wrap'}>
            {characterKeys.map(characterKey => {
              return (
                <Character
                  key={characterKey}
                  characterKey={characterKey}
                  currentCharacter={character}
                  setCharacter={setCharacter}
                />
              );
            })}
          </Div>
        </ScrollView>
      </Div>
    </Modal>
  );
};
export default AvatarSelect;
