package com.mahmuduls.messmanager;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.content.SharedPreferences;

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

        SharedPreferences prefs = getSharedPreferences("MessManager", MODE_PRIVATE);
        String savedTheme = prefs.getString("theme", "system");
        boolean isDark;
        if ("system".equals(savedTheme)) {
            isDark = isSystemDarkMode();
        } else {
            isDark = "oled".equals(savedTheme);
        }
        setStatusBarColorDirect(isDark ? "#0a0a0a" : "#f2f4f8");

        getWindow().setDecorFitsSystemWindows(true);

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

    private void setStatusBarColorDirect(String colorHex) {
        try {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            int color = Color.parseColor(colorHex);
            window.setStatusBarColor(color);
            window.setNavigationBarColor(color);
            boolean light = Color.luminance(color) > 0.5;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                WindowInsetsController controller = window.getInsetsController();
                if (controller != null) {
                    controller.setSystemBarsAppearance(
                        light ? WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS : 0,
                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS);
                    controller.setSystemBarsAppearance(
                        light ? WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS : 0,
                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                int flags = window.getDecorView().getSystemUiVisibility();
                if (light) {
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                } else {
                    flags &= ~(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
                }
                window.getDecorView().setSystemUiVisibility(flags);
            }
        } catch (Exception e) {}
    }

    public class WebAppInterface {
        @JavascriptInterface
        public boolean isSystemDarkMode() {
            return MainActivity.this.isSystemDarkMode();
        }

        @JavascriptInterface
        public void setStatusBarColor(String colorHex) {
            mainHandler.post(() -> setStatusBarColorDirect(colorHex));
        }

        @JavascriptInterface
        public void saveTheme(String theme) {
            getSharedPreferences("MessManager", MODE_PRIVATE).edit().putString("theme", theme).apply();
        }
    }
}
