
#import "RNPdfScannerManager.h"
#import "DocumentScannerView.h"

@interface RNPdfScannerManager()
@property (strong, nonatomic) DocumentScannerView *scannerView;
@end

@implementation RNPdfScannerManager

//- (dispatch_queue_t)methodQueue
//{
//    return dispatch_get_main_queue();
//}

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onPictureTaken, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRectangleDetect, RCTBubblingEventBlock)


RCT_EXPORT_VIEW_PROPERTY(overlayColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(enableTorch, BOOL)
RCT_EXPORT_VIEW_PROPERTY(useFrontCam, BOOL)
RCT_EXPORT_VIEW_PROPERTY(useBase64, BOOL)
RCT_EXPORT_VIEW_PROPERTY(saveInAppDocument, BOOL)
RCT_EXPORT_VIEW_PROPERTY(captureMultiple, BOOL)
RCT_EXPORT_VIEW_PROPERTY(openCamera, BOOL)
RCT_EXPORT_VIEW_PROPERTY(detectionCountBeforeCapture, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(detectionRefreshRateInMS, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(saturation, float)
RCT_EXPORT_VIEW_PROPERTY(quality, float)
RCT_EXPORT_VIEW_PROPERTY(brightness, float)
RCT_EXPORT_VIEW_PROPERTY(contrast, float)

RCT_EXPORT_METHOD(capture) {

    [_scannerView capture];
}

RCT_EXPORT_METHOD(stopManually) {

    [_scannerView stopManually];
}

- (UIView*) view {
    NSLog(@"initView");
    _scannerView = [[DocumentScannerView alloc] init];
    return _scannerView;
}

@end
