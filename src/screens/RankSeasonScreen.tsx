import React from 'react';
import apis from 'src/modules/apis';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {Span} from 'src/components/common/Span';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {ActivityIndicator} from 'react-native';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';
import ListFlatlist from 'src/components/ListFlatlist';

export default function RankSeasonScreen() {
  const {data: rankSeasonRes, isLoading: rankSeasonLoading} = useApiSelector(
    apis.rankSeason._,
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    if (rankSeasonLoading) return;
    reloadGetWithToken(
      apis.rankSeason._(
        rankSeasonRes?.rank_season?.cwyear,
        rankSeasonRes?.rank_season?.cweek,
      ),
    );
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={rankSeasonRes?.rank_season?.rank_strategies || []}
      refreshing={rankSeasonLoading}
      title={
        <Span bold fontSize={19}>
          {rankSeasonRes?.rank_season ? (
            `${rankSeasonRes.rank_season.cwyear}년 ${rankSeasonRes.rank_season.cweek}번째 주`
          ) : (
            <ActivityIndicator />
          )}
        </Span>
      }
      renderItem={({item}) => <RankAward rankStrategy={item} />}
    />
  );
}

const RankAward = ({rankStrategy}) => {
  return (
    <Row itemsCenter py15 px15>
      <Col auto>
        <Span bold fontSize={16}>
          {rankStrategy.start_index}위 ~
        </Span>
      </Col>
      <Col auto mr10>
        <Span bold fontSize={16}>
          {rankStrategy.end_index}위
        </Span>
      </Col>
      <Col />
      <Col auto>
        <Span bold>{rankStrategy.award_amount}</Span>
      </Col>
      <Col auto mx10>
        <Img h20 w20 source={ICONS.klayIcon}></Img>
      </Col>
    </Row>
  );
};
