import React from 'react';
import {
  requireNativeComponent,
  NativeModules,
  View,
  Platform,
  PermissionsAndroid,
  DeviceEventEmitter,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import platforms from '../src/utils/platforms';

const RNPdfScanner = requireNativeComponent('RNPdfScanner', PdfScanner);
const CameraManager = NativeModules.RNPdfScannerManager || {};

class PdfScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionsAuthorized: Platform.OS === 'ios',
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(
  //     'nextProps.openCamera => ',
  //     nextProps.openCamera !== this.props.openCamera,
  //   );
  //   return nextProps.openCamera !== this.props.openCamera;
  // }

  onPermissionsDenied = () => {
    if (this.props.onPermissionsDenied) this.props.onPermissionsDenied();
  };

  componentDidMount() {
    this.getAndroidPermissions();
  }

  stopCamera() {
    CameraManager.stopManually();
  }

  async getAndroidPermissions() {
    if (Platform.OS !== 'android') return;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);

      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        this.setState({permissionsAuthorized: true});
      } else this.onPermissionsDenied();
    } catch (err) {
      this.onPermissionsDenied();
    }
  }

  static defaultProps = {
    onPictureTaken: () => {},
    onProcessing: () => {},
    numOfRectangles: () => {},
  };

  sendOnPictureTakenEvent(event) {
    return this.props.onPictureTaken(event.nativeEvent);
  }

  sendOnnumOfRectanglesEvent(event) {
    return this.props.numOfRectangles(event.nativeEvent);
  }

  sendOnRectanleDetectEvent(event) {
    if (!this.props.onRectangleDetect) return null;
    return this.props.onRectangleDetect(event.nativeEvent);
  }

  getImageQuality() {
    if (!this.props.quality) return 0.8;
    if (this.props.quality > 1) return 1;
    if (this.props.quality < 0.1) return 0.1;
    return this.props.quality;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      const {onPictureTaken, onProcessing, numOfRectangles} = this.props;
      DeviceEventEmitter.addListener('onPictureTaken', onPictureTaken);
      DeviceEventEmitter.addListener('onProcessingChange', onProcessing);
      DeviceEventEmitter.addListener('numOfRectangles', numOfRectangles);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      const {onPictureTaken, onProcessing, numOfRectangles} = this.props;
      DeviceEventEmitter.removeListener('onPictureTaken', onPictureTaken);
      DeviceEventEmitter.removeListener('onProcessingChange', onProcessing);
      DeviceEventEmitter.removeListener('numOfRectangles', numOfRectangles);
    }
    // this.stopCamera();
  }

  capture() {
    // NativeModules.RNPdfScannerManager.capture();
    if (this.state.permissionsAuthorized) CameraManager.capture();
  }

  render() {
    if (platforms.isAndroid) {
      if (!this.props.openCamera) return <View style={{flex: 1}} />;
    }

    console.log('activeCamera1 => ', this.props.openCamera);
    return (
      <RNPdfScanner
        {...this.props}
        numOfRectangles={this.sendOnnumOfRectanglesEvent.bind(this)}
        openCamera={this.props.openCamera}
        onPictureTaken={this.sendOnPictureTakenEvent.bind(this)}
        onRectangleDetect={this.sendOnRectanleDetectEvent.bind(this)}
        useFrontCam={this.props.useFrontCam || false}
        brightness={this.props.brightness || 0}
        saturation={this.props.saturation || 1}
        contrast={this.props.contrast || 1}
        quality={this.getImageQuality()}
        detectionCountBeforeCapture={
          this.props.detectionCountBeforeCapture || 5
        }
        detectionRefreshRateInMS={this.props.detectionRefreshRateInMS || 50}
      />
    );
    // }
  }
}

PdfScanner.propTypes = {
  onPictureTaken: PropTypes.func,
  onRectangleDetect: PropTypes.func,
  overlayColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  enableTorch: PropTypes.bool,
  openCamera: PropTypes.bool,
  useFrontCam: PropTypes.bool,
  saturation: PropTypes.number,
  brightness: PropTypes.number,
  contrast: PropTypes.number,
  detectionCountBeforeCapture: PropTypes.number,
  detectionRefreshRateInMS: PropTypes.number,
  quality: PropTypes.number,
  documentAnimation: PropTypes.bool,
  noGrayScale: PropTypes.bool,
  manualOnly: PropTypes.bool,
  ...View.propTypes, // include the default view properties
};

export default PdfScanner;
