import React, { memo, useCallback, forwardRef } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import type { BottomSheetTextInputProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';

const BottomSheetTextInputComponent = forwardRef<
  TextInput,
  BottomSheetTextInputProps
>(({ onFocus, onBlur, ...rest }, ref) => {
  //#region hooks
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  //#endregion

  //#region callbacks
  const handleOnFocus = useCallback(
    args => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents]
  );
  const handleOnBlur = useCallback(
    args => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents]
  );
  //#endregion

  return (
    <TextInput
      ref={ref}
      // onFocus={handleOnFocus}
      // onBlur={handleOnBlur}
      {...rest}
    />
  );
});

const BottomSheetTextInput = memo(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';

export default BottomSheetTextInput;