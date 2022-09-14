import React, {forwardRef} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';
import {useCallback} from 'react';

const BottomPopup = (
  {
    children,
    snapPoints,
    index = -1,
    backdrop = true,
    enablePanDownToClose = true,
    handleComponent = BottomSheetHandle,
    onChange=null,
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
      enableHandlePanningGesture={enablePanDownToClose}
      enableContentPanningGesture={enablePanDownToClose}
      handleComponent={handleComponent}
      ref={ref}
      index={index}
      backdropComponent={backdrop && renderBackdrop}
      snapPoints={snapPoints}
      onAnimate={onChange&&((_,t)=>onChange(t))}>
      {children}
    </BottomSheet>
  );
};

export default forwardRef(BottomPopup);
