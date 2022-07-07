import React, { useCallback } from 'react';
import { Div } from 'src/components/common/Div';
import { Span } from 'src/components/common/Span';
import { Style } from 'src/components/common/Style';
import { ActivityIndicator } from 'react-native';
import { varStyle } from 'src/modules/styles';
import { HAS_NOTCH } from 'src/modules/constants';

const Button = (props) => {
  const {
    primary,
    outlined,
    chipPrimary,
    chipOutlined,
    chipOutlinedGray,
    chipBlack,
    disabled,
    full,
    half,
    large,
    medium,
    small,
    withInput,
    label,
    isBottom,
    styleComp,
    isChipBtn,
    textStyleComp,
    textColor,
    rounded,
    loading,
    onPress,
    ...others
  } = props;
  const isChip =
    chipPrimary || chipOutlined || chipOutlinedGray || chipBlack || isChipBtn;
  const addHeight = isBottom ? (HAS_NOTCH ? 34 : 0) : 0;
  const showLoading = disabled ? false : loading
  const onPressHandler = useCallback(e => {
    if (disabled || loading) return
    if (onPress) {
      onPress(e)
    }
  }, [onPress, disabled, loading])
  return (
    <Div
      itemsCenter
      justifyCenter={!isBottom}
      styleComp={[
        ...(isChip
          ? [
              <Style bgPrimary isActive={chipPrimary} />,
              <Style bgBlack isActive={chipBlack} />,
              <Style bgWhite border borderPrimary isActive={chipOutlined} />,
              <Style
                bgWhite
                border
                borderGray500
                isActive={chipOutlinedGray}
              />,
              <Style h24 rounded19 px12 isActive={small} />,
              <Style h36 rounded19 px16 isActive={medium} />,
              <Style h56 rounded28 px30 isActive={large} />,
              <Style bgGray200 border0 isActive={disabled} />,
              <Style w="100%" px0 isActive={full} />,
              <Style w="48%" px0 isActive={half} />,
            ]
          : [
              <Style rounded8 bgPrimary isActive={primary} />,
              <Style
                rounded8
                border={!isBottom}
                borderTop={isBottom}
                borderPrimary
                bgWhite
                isActive={outlined}
              />,
              <Style h={38 + addHeight} px19 isActive={small} />,
              <Style h={42 + addHeight} px25 isActive={medium} />,
              <Style h={56 + addHeight} px30 isActive={large} />,
              <Style h={52 + addHeight} px16 isActive={withInput} />,
              <Style w="100%" rounded0 isActive={full} />,
              <Style w="50%" rounded0 isActive={half} />,
              <Style
                bgGray300
                border0
                borderTop0
                borderBottom0
                borderLeft0
                borderRight0
                isActive={disabled}
              />,
              <Style pt18 isActive={isBottom} />,
              <Style rounded8 isActive={rounded} />,
            ]),
        styleComp,
      ]}
      {...others}
      onPress={onPressHandler}>
      <Span
        alignCenter
        header5
        styleComp={[
          ...(isChip
            ? [
                <Style white isActive={chipPrimary} />,
                <Style white isActive={chipBlack} />,
                <Style primary isActive={chipOutlined} />,
                <Style gray600 isActive={chipOutlinedGray} />,
                <Style header6 isActive={small} />,
                <Style header5 isActive={medium} />,
                <Style header5 isActive={large} />,
                <Style gray400 isActive={disabled} />,
              ]
            : [
                <Style header5 white isActive={!outlined} />,
                <Style header5 primary isActive={outlined} />,
                <Style header5 white isActive={disabled} />,
              ]),
          textStyleComp,
          <Style justifyCenter itemsCenter isActive={showLoading} />,
        ]}>
        {showLoading ? (
          <ActivityIndicator
            style={{paddingTop: 7}}
            color={
              outlined || chipOutlined || chipOutlinedGray
                ? varStyle.primary
                : varStyle.white
            }
          />
        ) : (
          label
        )}
      </Span>
      <Div h={addHeight}></Div>
    </Div>
  );
};

export default Button;