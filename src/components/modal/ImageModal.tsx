import React, {useEffect, useRef, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import {getAdjustedHeightFromDimensions} from 'src/modules/imageUtils';
import {DEVICE_HEIGHT} from 'src/modules/styles';
import {Div} from '../common/Div';
import {Img} from '../common/Img';

export const imageModalEventId = () => 'imageModalEvent';

export type ImageModalImage = {
  uri: string;
  width?: number;
  height: number;
};
export type ImageModalEventDataType = {
  image?: ImageModalImage;
  action: 'open' | 'close';
};

export default function ImageModal() {
  const width = DEVICE_HEIGHT - 30;
  const imageModalRef = useRef<Modal>(null);
  const [image, setImage] = useState<ImageModalImage>(null);
  useEffect(() => {
    EventRegister.addEventListener(
      imageModalEventId(),
      (data: ImageModalEventDataType) => {
        if (data.action == 'open') {
          imageModalRef?.current?.open();
          setImage(data.image);
        } else {
          imageModalRef?.current?.close();
        }
      },
    );
    return () => {
      EventRegister.removeEventListener(imageModalEventId());
    };
  }, []);
  return (
    <Modal
      ref={imageModalRef}
      useNativeDriverForBackdrop
      useNativeDriver
      isVisible={false}>
      <Div>
        {image && (
          <Img
            width={width}
            height={
              image.width && image.height
                ? getAdjustedHeightFromDimensions({
                    width: image.width,
                    height: image.height,
                    frameWidth: width,
                  })
                : width * 0.7
            }
            uri={image.uri}></Img>
        )}
      </Div>
    </Modal>
  );
}
