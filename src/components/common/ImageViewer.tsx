import React, {useEffect, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import ImageView from 'react-native-image-viewing';
import {expandImageViewerEvent} from 'src/utils/imageViewerUtils';

export default function ImageViewer() {
  const [data, setData] = useState({images: [], imageIndex: 0});

  useEffect(() => {
    const expandImagesListenerId = EventRegister.addEventListener(
      expandImageViewerEvent(),
      data => {
        setData(data);
      },
    );
    return () => {
      if (typeof expandImagesListenerId == 'string')
        EventRegister.removeEventListener(expandImagesListenerId);
    };
  }, []);
  return (
    <ImageView
      images={data.images}
      imageIndex={data.imageIndex}
      visible={data.images.length > 0}
      onRequestClose={() => setData({images: [], imageIndex: 0})}
    />
  );
}
