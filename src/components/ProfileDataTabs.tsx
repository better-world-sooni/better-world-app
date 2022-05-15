import React, {useState} from 'react';
import {Col} from './common/Col';
import DefaultMarkdown from './common/DefaultMarkdown';
import {Div} from './common/Div';
import Feed from './common/Feed';
import {Row} from './common/Row';
import {Span} from './common/Span';
import TruncatedMarkdown from './common/TruncatedMarkdown';
import NftCollectionMembers from './NftCollectionMembers';

export default function ProfileDataTabs({posts, about, members, adminNfts}) {
  enum DataTabType {
    Feed,
    Members,
    AdminNfts,
    Story,
  }
  const [currentTab, setCurrentTab] = useState(DataTabType.Feed);
  const tabProps = tab => {
    if (tab === currentTab)
      return {
        itemsCenter: true,
        py10: true,
        borderBottom1: true,
        borderPrimary: true,
        onPress: () => setCurrentTab(tab),
      };
    return {
      itemsCenter: true,
      py10: true,
      borderBottom1: true,
      borderGray200: true,
      onPress: () => setCurrentTab(tab),
    };
  };
  return (
    <Div bgWhite>
      <Row py8>
        <Col {...tabProps(DataTabType.Feed)}>
          <Span medium>피드</Span>
        </Col>
        <Col {...tabProps(DataTabType.Members)}>
          <Span medium>멤버</Span>
        </Col>
        <Col {...tabProps(DataTabType.AdminNfts)}>
          <Span medium>어드민</Span>
        </Col>
        <Col {...tabProps(DataTabType.Story)}>
          <Span medium>정보</Span>
        </Col>
      </Row>
      {
        {
          [DataTabType.Feed]: <Feed feed={posts} />,
          [DataTabType.Members]: <NftCollectionMembers members={members} />,
          [DataTabType.AdminNfts]: <NftCollectionMembers members={adminNfts} />,
          [DataTabType.Story]: <About about={about} />,
        }[currentTab]
      }
    </Div>
  );
}

function About({about}) {
  if (!about) {
    return (
      <Div itemsCenter py20>
        <Span>아직 정보가 업데이트 되어 있지 않습니다</Span>
      </Div>
    );
  }
  return (
    <Div mt10 px15 bgWhite>
      <DefaultMarkdown children={about} />
    </Div>
  );
}
