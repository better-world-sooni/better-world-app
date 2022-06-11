import React, {forwardRef, Fragment} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useMemo, useRef} from 'react';

const BottomPopup = (
  {
    children,
    snapPoints,
    index = -1,
    backdrop = true,
    enablePanDownToClose = true,
    handleComponent = BottomSheetHandle,
  },
  ref,
) => {
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={0.9} />
    ),
    [],
  );

  return (
    <BottomSheet
      enablePanDownToClose={enablePanDownToClose}
      enableHandlePanningGesture={false}
      handleComponent={handleComponent}
      ref={ref}
      index={index}
      backdropComponent={backdrop && renderBackdrop}
      snapPoints={snapPoints}>
      {children}
    </BottomSheet>
  );
};

export default forwardRef(BottomPopup);
