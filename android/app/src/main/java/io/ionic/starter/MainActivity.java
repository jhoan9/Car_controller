package io.ionic.starter;

import android.os.Bundle;

import com.capacitorjs.community.plugins.bluetoothle.BluetoothLe;
import com.capacitorjs.plugins.app.AppPlugin;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.plugin.http.Http;

import java.util.Arrays;


public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.bridgeBuilder.addPlugins(Arrays.asList(Http.class, BluetoothLe.class, AppPlugin.class));


    }
}
