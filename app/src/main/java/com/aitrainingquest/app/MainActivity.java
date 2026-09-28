package com.aitrainingquest.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String HOME = "file:///android_asset/index.html";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(7,17,31));
        getWindow().setNavigationBarColor(Color.rgb(7,17,31));
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(7,17,31));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(false);
        s.setTextZoom(100);

        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("file".equals(uri.getScheme())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
            @Override public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError error) {
                if (req.isForMainFrame()) view.loadUrl("file:///android_asset/error.html");
            }
        });
        webView.loadUrl(HOME);
    }

    @Override public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript("(function(){var a=document.querySelector('.screen.active .back');if(a){a.click();return 'handled'}return 'no'})()", v -> {
                if (v != null && v.contains("handled")) return;
                if (webView.canGoBack()) webView.goBack(); else MainActivity.super.onBackPressed();
            });
        } else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (webView != null) { webView.stopLoading(); webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
