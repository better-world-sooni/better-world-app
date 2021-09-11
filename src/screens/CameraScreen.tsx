import { RNCamera } from 'react-native-camera';
import React from 'react';
import {
useNavigation
} from '@react-navigation/native';
import { NAV_NAMES } from 'src/modules/navNames';
import { StyleSheet } from 'react-native';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import { X } from 'react-native-feather';

const PendingView = () => (
    <Div
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Span>Waiting</Span>
    </Div>
  );
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });

  
const CameraScreen = () => {

    const navigation = useNavigation()

    const onPressExit = () => {
		navigation.navigate(NAV_NAMES.Home)
    }

    const takePicture = async (camera) => {
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        //  eslint-disable-next-line
        console.log(data.uri);
      };

    return(
        <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          >
            {({ camera, status, recordAudioPermissionStatus }) => {
              if (status !== 'READY') return <PendingView />;
              return (
                <Div width={"100%"} flex={1} justifyContent={'center'} py20>
                  <Row px20>
                    <Col ></Col>
                    <Col bgWhite auto>
                      <Div onPress={(e) => onPressExit()}>
                        <X stroke="#2e2e2e" fill="#fff" width={18} ></X>
                      </Div>
                    </Col>
                  </Row>
                  <Div auto flex={1} ></Div>
                  <Div >
                    <Div onPress={() => takePicture(camera)} style={styles.capture}>
                      <Span style={{ fontSize: 14 }}> SNAP </Span>
                    </Div>
                  </Div>
                </Div>
              );
            }}
          </RNCamera>
    )
}

export default CameraScreen;