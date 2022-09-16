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
    enableContentPanningGesture = true,
    handleComponent = BottomSheetHandle,
    bottomInset=0,
    onChange=null,
    onClose=null,
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
      enableContentPanningGesture={enableContentPanningGesture}
      handleComponent={handleComponent}
      ref={ref}
      index={index}
      backdropComponent={backdrop && renderBackdrop}
      snapPoints={snapPoints}
      bottomInset={bottomInset}
      onAnimate={onChange&&((_,t)=>onChange(t))}
      onClose={onClose}>
      {children}
    </BottomSheet>
  );
};

export default forwardRef(BottomPopup);
