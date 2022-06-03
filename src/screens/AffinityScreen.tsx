import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ChevronLeft} from 'react-native-feather';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';

export default function AffinityScreen({
  route: {
    params: {nftCollection},
  },
}) {
  const headerHeight = HAS_NOTCH ? 94 : 70;
  const {goBack} = useNavigation();
  return (
    <Div flex={1} bgWhite>
      <Div h={headerHeight} zIndex={100}>
        <Row
          itemsCenter
          py5
          h40
          px8
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={HAS_NOTCH ? 49 : 25}>
          <Col justifyStart mr10>
            <Div auto rounded100 onPress={goBack}>
              <ChevronLeft
                width={30}
                height={30}
                color="black"
                strokeWidth={2}
              />
            </Div>
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              컬렉션 친목도
            </Span>
          </Col>
          <Col />
        </Row>
      </Div>
      <Div px15>
        <Span
          fontSize={16}
          style={{
            textAlign: 'center',
          }}>
          멤버 친목도는 컬렉션 멤버끼리의 팔로우를 세어 추산하는 척도입니다.{' '}
          <Span bold info>
            {nftCollection.name}
          </Span>
          의 모든 멤버들이 서로 팔로우를 하면{' '}
          <Span bold>{nftCollection.affinity.total_possible_follows}</Span>개의
          팔로우가 생성됩니다. 현재{' '}
          <Span bold info>
            {nftCollection.name}
          </Span>{' '}
          멤버 사이 팔로우는{' '}
          <Span bold>{nftCollection.affinity.follows_among_members}</Span>개
          입니다. 그리하여 멤버 친목도는 (
          <Span>{nftCollection.affinity.follows_among_members}</Span> /{' '}
          <Span>{nftCollection.affinity.total_possible_follows}</Span>) * 100% ={' '}
          <Span bold>
            {Math.ceil(
              (nftCollection.affinity.follows_among_members /
                nftCollection.affinity.total_possible_follows) *
                100,
            )}
          </Span>
          % 으로 추산할 수 있습니다.
        </Span>
        <Span
          mt10
          fontSize={16}
          style={{
            textAlign: 'center',
          }}>
          멤버 친목도가 100%에 근접할 수록 건강한 커뮤니티가 되는 것은 아니니
          걱정마세요! 실제 20 ~ 30%만 되어도 건강하고 친한 커뮤니티가 생성될 수
          있습니다.
        </Span>
      </Div>
    </Div>
  );
}
