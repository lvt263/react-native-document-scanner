import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import Scanner from 'react-native-document-scanner';
import CameraIcon from './take_picture.svg';

import {Color} from './Colors';
import scales from './scales';
import platforms from './platforms';

export default class CameraScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      flashEnabled: false,
      useFrontCam: false,
      numberBeforeCapture: 0,
    };
  }

  renderImage() {
    if (Platform.OS == 'ios') {
      return (
        <Image
          style={styles.viewScanner}
          source={{uri: `data:image/jpeg;base64,${this.state.image}`}}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Image
          style={styles.viewScanner}
          source={{uri: this.state.image}}
          resizeMode="contain"
        />
      );
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: Color.cl_background_camera}}>
        <View style={styles.container}>
          <View style={styles.topButtons}>
            <TouchableOpacity
              style={styles.viewChangleFlash}
              onPress={() => {
                this.setState({flashEnabled: !this.state.flashEnabled});
              }}>
              <Text style={styles.textFlipCamera}>Flash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.flipCamera}
              style={styles.flipButton}>
              <Text style={styles.textFlipCamera}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({image: ''});
              }}
              style={styles.viewTextClose}>
              <Text style={styles.textFlipCamera}> ReCapture </Text>
            </TouchableOpacity>
          </View>

          {this.state.image ? (
            this.renderImage()
          ) : (
            <View style={styles.viewScanner}>
              <Scanner
                ref={ref => (this.scanner = ref)}
                useBase64
                numOfRectangles={data => {
                  this.setState({numberBeforeCapture: data.numOfRectangles});
                }}
                onPictureTaken={data => {
                  this.setState({
                    image: data.croppedImage,
                    numberBeforeCapture: 0,
                  });
                }}
                overlayColor="rgba(82, 201, 92, 0.3)"
                enableTorch={this.state.flashEnabled}
                useFrontCam={this.state.useFrontCam}
                // brightness={0.2}
                saturation={0}
                quality={1}
                // contrast={1.2}
                onRectangleDetect={({stableCounter, lastDetectionType}) => {
                  // this.setState({ stableCounter, lastDetectionType })
                  this.setState({numberBeforeCapture: stableCounter});
                }}
                detectionCountBeforeCapture={10}
                detectionRefreshRateInMS={50}
                style={styles.scanner}
              />
            </View>
          )}

          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.takeFrontCard}
              onPress={() => {
                this.setState({
                  isSelectedFront: true,
                  isSelectedBack: false,
                  isShowTextBack: false,
                });
              }}>
              <Text />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (this.scanner != null) {
                  this.scanner.capture();
                }
              }}
              style={styles.recordingButton}>
              <CameraIcon
                width={scales.horizontal(50)}
                height={scales.horizontal(50)}
              />
              {this.state.numberBeforeCapture >= 7 &&
              this.state.numberBeforeCapture <= 10 ? (
                <Text style={{position: 'absolute', color: 'black'}}>
                  {10 - this.state.numberBeforeCapture}
                </Text>
              ) : (
                <Text style={{position: 'absolute', color: 'black'}} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.takeFrontCard}
              onPress={() => {
                this.setState({
                  isSelectedFront: false,
                  isSelectedBack: true,
                  isShowTextBack: true,
                });
              }}>
              <Text
                style={
                  this.state.isSelectedBack === true
                    ? styles.textTakePicSelected
                    : styles.textTakePic
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Color.cl_background_camera,
  },
  preview: {
    width: scales.horizontal(273),
    height: scales.horizontal(417),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scales.horizontal(13),
    borderColor: Color.cl_border_frame_camera,
  },
  topButtons: {
    // width: platforms.widthScreen,
    height: '8%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    // alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    height: '12%',
    width: platforms.widthScreen,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  recordingButton: {
    marginTop: scales.vertical(10),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  viewCamera: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.cl_background_view_cam,
    height: '80%',
  },
  flipButton: {
    flex: 4,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFlipCamera: {
    fontSize: scales.moderate(14),
    color: Color.white,
  },
  viewTextClose: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  textCloseCamera: {
    fontSize: scales.moderate(15),
    color: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewChangleFlash: {
    flex: 3,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFlash: {
    alignItems: 'center',
  },
  takeFrontCard: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scales.vertical(30),
  },
  textTakePic: {
    color: Color.white,
    fontSize: scales.moderate(17),
  },
  textTakePicSelected: {
    color: Color.cl_text_selected_camera,
    fontSize: scales.moderate(17),
  },
  frameCamera: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.yellow,
  },
  textNote: {
    color: Color.white,
    fontSize: scales.vertical(15),
    marginBottom: scales.vertical(10),
  },
  cameraNotAuthorized: {
    padding: scales.moderate(20),
    paddingTop: scales.vertical(35),
    fontSize: scales.moderate(15),
    color: Color.white,
  },
  textBack: {
    fontSize: scales.horizontal(80),
    color: Color.cl_text_accept,
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  scanner: {
    aspectRatio: 9 / 16,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 80,
  },

  viewScanner: {
    position: 'absolute',
    top: '8%',
    right: 0,
    left: 0,
    overflow: 'hidden',
    bottom: 0,
  },
});
