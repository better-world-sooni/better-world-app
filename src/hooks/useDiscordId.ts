import {useState} from 'react';
import {Linking} from 'react-native';
import useEdittableText from './useEdittableText';

export default function useDiscordId(nft) {
  const [discordId, discordIdHasChanged, handleChangeText] = useEdittableText(
    nft?.discord_id,
  );
  const [discordIdError, setDiscordIdError] = useState('');
  const [isDiscordIdEditting, setIsEditting] = useState(false);
  const discordProfileLink = discordId
    ? `https://www.discordapp.com/users/${discordId}`
    : null;
  const isDiscordIdSavable = isDiscordIdEditting && !discordIdError;

  const isError = isDiscordIdError;

  const handlePressDiscordLink = () => {
    if (discordProfileLink) Linking.openURL(discordProfileLink);
  };
  const toggleDiscordIdEdit = () => {
    if (isDiscordIdSavable) {
      setIsEditting(false);
    } else if (!isDiscordIdEditting) {
      setIsEditting(true);
    }
  };
  const handleChangeDiscordId = text => {
    const error = getNameError(text);
    setDiscordIdError(error);
    handleChangeText(text);
  };
  const getNameError = value => {
    if (isDiscordIdError(value)) {
      return '유효한 디스코드 아이디가 아닙니다.';
    }
    return '';
  };

  return {
    discordId,
    discordProfileLink,
    discordIdHasChanged,
    discordIdError,
    isDiscordIdEditting,
    isDiscordIdSavable,
    toggleDiscordIdEdit,
    handlePressDiscordLink,
    handleChangeDiscordId,
    isError,
  };
}

export const isDiscordIdError = value => {
  if (!/^.{3,32}#[0-9]{4}$/.test(value)) {
    return true;
  }
  return false;
};
