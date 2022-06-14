package com.documentscanner;

import com.documentscanner.views.MainView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;

/**
 * Created by andre on 28/11/2017.
 */

public class DocumentScannerModule extends ReactContextBaseJavaModule{

    public DocumentScannerModule(ReactApplicationContext reactContext){
        super(reactContext);
    }


    @Override
    public String getName() {
        return "RNPdfScannerManager";
    }

    @ReactMethod
    public void capture(){
        MainView view = MainView.getInstance();
        view.capture();
    }

    @ReactMethod
    public void stopManually(){
        Log.d("react call", "CAMERA STOP ===> ");
        MainView view = MainView.getInstance();
        if (view != null) {
            view.stopCamera();
        }
    }

    @ReactMethod
    public void startManually(){
        Log.d("react call", "CAMERA START ===> ");
        MainView view = MainView.getInstance();
        if (view != null) {
            view.startCamera();
        }
    }

    @ReactMethod
    public void checkNotNullCamera(){
        Log.d("react call", "CAMERA checkNotNullCamera ===> ");
        MainView view = MainView.getInstance();
        if (view != null) {
            Log.d("react call", "CAMERA checkNotNullCamera inside ===> ");
            view.checkNotNullCamera();
        }
    }

}
