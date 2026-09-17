package com.mahmuduls.messmanager;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.capacitorjs.plugins.statusbar.StatusBarPlugin;
import ee.forgr.capacitor_navigation_bar.CapgoNavigationBarPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GoogleAuth.class);
        registerPlugin(StatusBarPlugin.class);
        registerPlugin(CapgoNavigationBarPlugin.class);
        registerPlugin(SystemBarsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
