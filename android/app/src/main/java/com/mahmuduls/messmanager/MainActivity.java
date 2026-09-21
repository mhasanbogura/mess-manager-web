package com.mahmuduls.messmanager;

import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleEventObserver;
import androidx.lifecycle.LifecycleOwner;

import com.getcapacitor.BridgeActivity;
import com.capacitorjs.plugins.statusbar.StatusBarPlugin;
import ee.forgr.capacitor_navigation_bar.CapgoNavigationBarPlugin;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity implements LifecycleEventObserver {
    private Handler mainHandler;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        mainHandler = new Handler(Looper.getMainLooper());
        registerPlugin(StatusBarPlugin.class);
        registerPlugin(CapgoNavigationBarPlugin.class);
        registerPlugin(SystemBarsPlugin.class);
        registerPlugin(GoogleAuth.class);
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        getLifecycle().addObserver(this);
    }

    @Override
    public void onStateChanged(LifecycleOwner source, Lifecycle.Event event) {
        if (event == Lifecycle.Event.ON_RESUME) {
            pushDarkModeToWebView();
        }
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        pushDarkModeToWebView();
    }

    private void pushDarkModeToWebView() {
        if (mainHandler == null) return;
        mainHandler.postDelayed(() -> {
            try {
                WebView webView = getBridge().getWebView();
                boolean isDark = isSystemDarkMode();
                webView.evaluateJavascript(
                    "window._androidDarkMode=" + isDark + ";if(typeof App!=='undefined'&&typeof App.applyTheme==='function')App.applyTheme()",
                    null);
            } catch (Exception e) {}
        }, 150);
    }

    private boolean isSystemDarkMode() {
        int nightMask = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return nightMask == Configuration.UI_MODE_NIGHT_YES;
    }

    public class WebAppInterface {
        @JavascriptInterface
        public boolean isSystemDarkMode() {
            return MainActivity.this.isSystemDarkMode();
        }
    }
}
