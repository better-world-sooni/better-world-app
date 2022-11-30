import {useState} from 'react';
import {Linking} from 'react-native';
import useEdittableText from './useEdittableText';

export default function useTwitterId(nft) {
  const [twitterId, twitterIdHasChanged, handleChangeText] = useEdittableText(
    nft?.twitter_id,
  );
  const [twitterIdError, setTwitterIdError] = useState('');
  const [isTwitterIdEditting, setIsEditting] = useState(false);
  const twitterProfileLink = twitterId
    ? `https://www.twitter.com/${twitterId}`
    : null;
  const isTwitterIdSavable = isTwitterIdEditting && !twitterIdError;

  const isError = isTwitterIdError;

  const handlePressTwitterLink = () => {
    if (twitterProfileLink) Linking.openURL(twitterProfileLink);
  };
  const toggleTwitterIdEdit = () => {
    if (isTwitterIdSavable) {
      setIsEditting(false);
    } else if (!isTwitterIdEditting) {
      setIsEditting(true);
    }
  };
  const handleChangeTwitterId = text => {
    const error = getNameError(text);
    setTwitterIdError(error);
    handleChangeText(text);
  };
  const getNameError = value => {
    if (isTwitterIdError(value)) {
      return '유효한 트위터 아이디가 아닙니다.';
    }
    return '';
  };

  return {
    twitterId,
    twitterProfileLink,
    twitterIdHasChanged,
    twitterIdError,
    isTwitterIdEditting,
    isTwitterIdSavable,
    toggleTwitterIdEdit,
    handlePressTwitterLink,
    handleChangeTwitterId,
    isError,
  };
}

export const isTwitterIdError = value => {
  if (!/^@?(\w){1,15}$/.test(value)) {
    return true;
  }
  return false;
};
