import {MenuView} from '@react-native-menu/menu';
import React, {useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import {ChevronRight, Edit2, Minus, Plus} from 'react-native-feather';
import {ICONS} from 'src/modules/icons';
import {Colors} from 'src/modules/styles';
import {openInfoPopup} from 'src/utils/bottomPopupUtils';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {TextInput} from './common/ViewComponents';

const addOptions = [
  {
    id: 'link',
    title: '링크 추가',
  },
  {
    id: 'select',
    title: '선택 카테고리 추가',
  },
  {
    id: 'input',
    title: '유저 입력란 추가',
    subactions: [
      {
        id: 'twitterIdInput',
        title: '트위터 아이디',
      },
      {
        id: 'discordIdInput',
        title: '디스코드 아이디',
      },
      {
        id: 'customInput',
        title: '커스텀',
      },
    ],
  },
];

export enum EventApplicationInputType {
  SELECT = 0,
  CUSTOM_INPUT = 1,
  TWITTER_ID = 2,
  DISCORD_ID = 3,
  LINK = 4,
}

export type EventApplicationCategory = {
  name: string;
  category: string;
  options: string[];
  inputType: EventApplicationInputType;
};

export default function NewEventApplicationOptions({
  applicationCategories,
  addApplicationCategory,
  removeApplicationCategory,
  changeApplicationName,
  addApplicationOption,
  removeApplicationOption,
}) {
  const [activeSections, setActiveSections] = useState([]);
  const [categoryToAdd, setCategoryToAdd] = useState('');
  const handleChangeCategoryToAdd = text => {
    setCategoryToAdd(text);
  };
  const handlePressSection = index => {
    if (activeSections.includes(index))
      setActiveSections(activeSections.filter(item => item !== index));
    else setActiveSections([...activeSections, index]);
  };
  const handlePressAddOrderCategory = ({nativeEvent: {event}}) => {
    if (event == 'select') {
      if (!categoryToAdd) {
        openInfoPopup('선택 카테고리 이름을 먼저 작성해주세요.');
        return;
      }
      addApplicationCategory(categoryToAdd, EventApplicationInputType.SELECT);
      setActiveSections([...activeSections, activeSections.length]);
    } else if (event == 'twitterIdInput') {
      addApplicationCategory(
        '트위터 아이디',
        EventApplicationInputType.TWITTER_ID,
      );
    } else if (event == 'discordIdInput') {
      addApplicationCategory(
        '디스코드 아이디',
        EventApplicationInputType.DISCORD_ID,
      );
    } else if (event == 'customInput') {
      if (!categoryToAdd) {
        openInfoPopup('유저 입력란 제목을 작성해주세요.');
        return;
      }
      addApplicationCategory(
        categoryToAdd,
        EventApplicationInputType.CUSTOM_INPUT,
      );
    } else if (event == 'link') {
      if (!categoryToAdd) {
        openInfoPopup('링크 이름을 작성해주세요.');
        return;
      }
      addApplicationCategory(categoryToAdd, EventApplicationInputType.LINK);
    }
    setCategoryToAdd('');
  };
  const handleRemoveApplicationCategory = index => {
    setActiveSections([]);
    removeApplicationCategory(index);
  };

  return (
    <Div border={0.5} borderGray200 rounded10 overflowHidden>
      <Accordion
        expandMultiple
        activeSections={activeSections}
        sections={applicationCategories as EventApplicationCategory[]}
        underlayColor={Colors.opacity[100]}
        renderHeader={(content, index) => (
          <Row
            wFull
            py12
            px16
            borderBottom={0.5}
            borderGray200
            itemsCenter
            {...((content.inputType == EventApplicationInputType.SELECT ||
              content.inputType == EventApplicationInputType.LINK) && {
              onPress: () => handlePressSection(index),
            })}>
            <Col auto pr8>
              {content.inputType == EventApplicationInputType.CUSTOM_INPUT ? (
                <Edit2
                  height={18}
                  width={18}
                  color={Colors.black}
                  strokeWidth={2}
                />
              ) : content.inputType == EventApplicationInputType.DISCORD_ID ? (
                <Img h={232 / 16} w={300 / 16} source={ICONS.discord} />
              ) : content.inputType == EventApplicationInputType.TWITTER_ID ? (
                <Img h={18} w={18} source={ICONS.twitter} />
              ) : (
                <ChevronRight
                  height={18}
                  width={18}
                  color={Colors.black}
                  strokeWidth={2}
                />
              )}
            </Col>
            <Col>
              <Span
                bold
                fontSize={16}
                gray400={
                  !(
                    content.inputType === EventApplicationInputType.SELECT ||
                    content.inputType === EventApplicationInputType.LINK
                  )
                }>
                {content.category}
              </Span>
            </Col>
            <Col auto onPress={() => handleRemoveApplicationCategory(index)}>
              <Minus height={22} color={Colors.black} strokeWidth={2} />
            </Col>
          </Row>
        )}
        renderContent={(content, index) => (
          <>
            {content.inputType == EventApplicationInputType.SELECT && (
              <EventApplicationOptions
                applicationCategory={content}
                categoryIndex={index}
                addApplicationOption={addApplicationOption}
                removeApplicationOption={removeApplicationOption}
              />
            )}
            {content.inputType == EventApplicationInputType.LINK && (
              <EventApplicationLink
                initialLink={content.name}
                changeApplicationName={value =>
                  changeApplicationName(index, value)
                }
              />
            )}
          </>
        )}
        onChange={() => {}}
      />
      <Row py12 px16 itemsCenter>
        <Col>
          <TextInput
            value={categoryToAdd}
            placeholder={'추가할 선택 카테고리 또는 유저 입력란 이름'}
            fontSize={14}
            w={'100%'}
            onChangeText={handleChangeCategoryToAdd}></TextInput>
        </Col>
        <Col auto>
          <MenuView
            onPressAction={handlePressAddOrderCategory}
            actions={addOptions}>
            <Plus
              height={22}
              color={!!categoryToAdd ? Colors.black : Colors.gray[400]}
              strokeWidth={2}
            />
          </MenuView>
        </Col>
      </Row>
    </Div>
  );
}

function EventApplicationOptions({
  applicationCategory,
  categoryIndex,
  addApplicationOption,
  removeApplicationOption,
}) {
  const [optionToAdd, setOptionToAdd] = useState('');
  const handleChangeOptionToAdd = text => {
    setOptionToAdd(text);
  };
  const handlePressAddOrderOption = () => {
    if (optionToAdd) {
      addApplicationOption(categoryIndex, optionToAdd);
      setOptionToAdd('');
    }
  };
  return (
    <>
      {applicationCategory.options.map((option, index) => (
        <Row wFull py12 px16 bgGray100 itemsCenter>
          <Col>
            <Span fontSize={14} bold>
              {option}
            </Span>
          </Col>
          <Col
            auto
            onPress={() => removeApplicationOption(categoryIndex, index)}>
            <Minus height={19} color={Colors.black} strokeWidth={2} />
          </Col>
        </Row>
      ))}
      <Row py12 px16 itemsCenter bgGray100>
        <Col>
          <TextInput
            value={optionToAdd}
            placeholder={'추가할 옵션'}
            fontSize={14}
            w={'100%'}
            onChangeText={handleChangeOptionToAdd}></TextInput>
        </Col>
        <Col auto onPress={handlePressAddOrderOption}>
          <Plus
            height={19}
            color={!!optionToAdd ? Colors.black : Colors.gray[400]}
            strokeWidth={2}
          />
        </Col>
      </Row>
    </>
  );
}

function EventApplicationLink({initialLink, changeApplicationName}) {
  const [linkToChange, setLinkToChange] = useState(initialLink);
  const handleChangeLinkToChange = text => {
    setLinkToChange(text);
  };
  const handlePressChangeLink = () => {
    if (linkToChange) {
      changeApplicationName(linkToChange);
      setLinkToChange(linkToChange);
    }
  };
  const changed = !(initialLink == linkToChange);
  return (
    <>
      <Row py12 px16 itemsCenter bgGray100>
        <Col>
          <TextInput
            value={linkToChange}
            placeholder={'링크 (google form, typeform, etc..)'}
            fontSize={14}
            w={'100%'}
            autoCapitalize={'none'}
            onChangeText={handleChangeLinkToChange}></TextInput>
        </Col>
        {changed && (
          <Col auto onPress={handlePressChangeLink}>
            <Plus
              height={19}
              color={!!linkToChange ? Colors.black : Colors.gray[400]}
              strokeWidth={2}
            />
          </Col>
        )}
      </Row>
    </>
  );
}
