#import "DocumentScannerView.h"
#import "IPDFCameraViewController.h"

@implementation DocumentScannerView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self setEnableBorderDetection:YES];
        [self setDelegate: self];
    }
    
    return self;
}


- (void) didDetectRectangle:(CIRectangleFeature *)rectangle withType:(IPDFRectangeType)type {
    switch (type) {
        case IPDFRectangeTypeGood:
            NSLog(@"stableCounter ====> %ld", (long)self.stableCounter);
            NSLog(@"type ====> %ld", (long)type);
            NSLog(@"openCamera222 ====> %d", self.openCamera);
            if(self.openCamera){
                self.stableCounter ++;
            }
            break;
        default:
            self.stableCounter = 0;
            break;
    }
    if (self.onRectangleDetect) {
        self.onRectangleDetect(@{@"stableCounter": @(self.stableCounter), @"lastDetectionType": @(type)});
    }
    
    if (self.stableCounter > self.detectionCountBeforeCapture && self.openCamera){
        self.stableCounter = 0;
        [self capture];
    }
}

/*!
 After capture, the image is stored and sent to the event handler
 */
//- (void) capture {
//[self captureImageWithCompletionHander:^(UIImage *croppedImage, UIImage *initialImage, CIRectangleFeature *lastRectangleFeature) {
//  if (self.onPictureTaken) {
//      NSLog(@"RUN 7777 ====> ");
//  NSString *dir = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
//  NSString *storageFolder = @"RNRectangleScanner";
//
//  dir = [dir stringByAppendingPathComponent:storageFolder];
//
//  NSFileManager *fileManager= [NSFileManager defaultManager];
//  NSError *error = nil;
//  if(![fileManager createDirectoryAtPath:dir withIntermediateDirectories:YES attributes:nil error:&error]) {
//    // An error has occurred, do something to handle it
//    NSLog(@"Failed to create directory \"%@\". Error: %@", dir, error);
////    [self onErrorOfImageProcessor:@{@"message": @"Failed to create the cache directory"}];
//    return;
//  }
//
//  NSString *croppedFilePath = [dir stringByAppendingPathComponent:[NSString stringWithFormat:@"C%i.jpeg",(int)[NSDate date].timeIntervalSince1970]];
//  NSString *initialFilePath = [dir stringByAppendingPathComponent:[NSString stringWithFormat:@"O%i.jpeg",(int)[NSDate date].timeIntervalSince1970]];
//  bool hasCroppedImage = (croppedImage != nil);
//  if (!hasCroppedImage) {
//    croppedFilePath = initialFilePath;
//  }
//
//
//  if (self.onPictureTaken) {
//      NSLog(@"RUN 8888 ====> ");
//    self.onPictureTaken(@{
//      @"croppedImage": croppedFilePath,
//      @"initialImage": initialFilePath
//    });
//  }
//
//  float quality = 0.5;
//  if (self.quality) {
//    quality = self.quality;
//  }
//  @autoreleasepool {
//    if (hasCroppedImage) {
//      NSData *croppedImageData = UIImageJPEGRepresentation(croppedImage, quality);
//      if (![croppedImageData writeToFile:croppedFilePath atomically:YES]) {
//        NSMutableDictionary *errorBody = [[NSMutableDictionary alloc] init];
//        [errorBody setValue:@"Failed to write cropped image to cache" forKey:@"message"];
//        [errorBody setValue:croppedFilePath forKey:@"filePath"];
////        [self onErrorOfImageProcessor:errorBody];
//        return;
//      }
//    }
//
//    NSData *initialImageData = UIImageJPEGRepresentation(initialImage, quality);
//    if (![initialImageData writeToFile:initialFilePath atomically:YES]) {
//      NSMutableDictionary *errorBody = [[NSMutableDictionary alloc] init];
//      [errorBody setValue:@"Failed to write original image to cache" forKey:@"message"];
//      [errorBody setValue:initialFilePath forKey:@"filePath"];
////      [self onErrorOfImageProcessor:errorBody];
//      return;
//    }
//
////    if (self.onPictureProcessed) {
////      self.onPictureProcessed(@{
////        @"croppedImage": croppedFilePath,
////        @"initialImage": initialFilePath
////      });
////    }
//  }
//  }
//}];
//}

- (void) stopManually {
    [self stop];
}

- (void) capture {
    [self captureImageWithCompletionHander:^(UIImage *croppedImage, UIImage *initialImage, CIRectangleFeature *rectangleFeature) {
        
        if (self.onPictureTaken) {
            NSLog(@"RUN 1111 ====> ");
            NSData *croppedImageData = UIImageJPEGRepresentation(croppedImage, self.quality);
            
            if (initialImage.imageOrientation != UIImageOrientationUp) {
                NSLog(@"RUN 2222 ====> ");
                UIGraphicsBeginImageContextWithOptions(initialImage.size, false, initialImage.scale);
                [initialImage drawInRect:CGRectMake(0, 0, initialImage.size.width
                                                    , initialImage.size.height)];
                initialImage = UIGraphicsGetImageFromCurrentImageContext();
                UIGraphicsEndImageContext();
            }
            NSData *initialImageData = UIImageJPEGRepresentation(initialImage, self.quality);
            
            /*
             RectangleCoordinates expects a rectanle viewed from portrait,
             while rectangleFeature returns a rectangle viewed from landscape, which explains the nonsense of the mapping below.
             Sorry about that.
             */
            NSDictionary *rectangleCoordinates = rectangleFeature ? @{
                @"topLeft": @{ @"y": @(rectangleFeature.bottomLeft.x + 30), @"x": @(rectangleFeature.bottomLeft.y)},
                @"topRight": @{ @"y": @(rectangleFeature.topLeft.x + 30), @"x": @(rectangleFeature.topLeft.y)},
                @"bottomLeft": @{ @"y": @(rectangleFeature.bottomRight.x), @"x": @(rectangleFeature.bottomRight.y)},
                @"bottomRight": @{ @"y": @(rectangleFeature.topRight.x), @"x": @(rectangleFeature.topRight.y)},
            } : [NSNull null];
            if (self.useBase64) {
                NSLog(@"RUN 3333 ====> ");
                self.onPictureTaken(@{
                    @"croppedImage": [croppedImageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength],
                    @"initialImage": [initialImageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength],
                    @"rectangleCoordinates": rectangleCoordinates });
            }
            else {
                NSLog(@"RUN 4444 ====> ");
                NSString *dir = NSTemporaryDirectory();
                if (self.saveInAppDocument) {
                    NSLog(@"RUN 5555 ====> ");
                    dir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
                }
                NSString *croppedFilePath = [dir stringByAppendingPathComponent:[NSString stringWithFormat:@"cropped_img_%i.jpeg",(int)[NSDate date].timeIntervalSince1970]];
                NSString *initialFilePath = [dir stringByAppendingPathComponent:[NSString stringWithFormat:@"initial_img_%i.jpeg",(int)[NSDate date].timeIntervalSince1970]];
                
                [croppedImageData writeToFile:croppedFilePath atomically:YES];
                [initialImageData writeToFile:initialFilePath atomically:YES];
                self.onPictureTaken(@{
                    @"croppedImage": croppedFilePath,
                    @"initialImage": initialFilePath,
                    @"rectangleCoordinates": rectangleCoordinates });
            }
        }
        
        if (!self.captureMultiple) {
            NSLog(@"RUN 66666 ====> ");
            [self stop];
        }
        
    }];
    
}


@end
