cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-firebase-analytics.FirebaseAnalytics",
      "file": "plugins/cordova-plugin-firebase-analytics/www/FirebaseAnalytics.js",
      "pluginId": "cordova-plugin-firebase-analytics",
      "merges": [
        "cordova.plugins.firebase.analytics"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.IonicWebView",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "Ionic.WebView"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.ios-wkwebview-exec",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/ios/ios-wkwebview-exec.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "cordova.exec"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova-sqlite-storage.SQLitePlugin",
      "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
      "pluginId": "cordova-sqlite-storage",
      "clobbers": [
        "SQLitePlugin"
      ]
    },
    {
      "id": "onesignal-cordova-plugin.OneSignalPlugin",
      "file": "plugins/onesignal-cordova-plugin/dist/index.js",
      "pluginId": "onesignal-cordova-plugin",
      "clobbers": [
        "OneSignal"
      ]
    },
    {
      "id": "onesignal-cordova-plugin.NotificationReceivedEvent",
      "file": "plugins/onesignal-cordova-plugin/dist/NotificationReceivedEvent.js",
      "pluginId": "onesignal-cordova-plugin"
    },
    {
      "id": "onesignal-cordova-plugin.Subscription",
      "file": "plugins/onesignal-cordova-plugin/dist/Subscription.js",
      "pluginId": "onesignal-cordova-plugin"
    },
    {
      "id": "onesignal-cordova-plugin.OSNotification",
      "file": "plugins/onesignal-cordova-plugin/dist/OSNotification.js",
      "pluginId": "onesignal-cordova-plugin"
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-androidx": "3.0.0",
    "cordova-plugin-androidx-adapter": "1.1.3",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-firebase-analytics": "5.0.0",
    "cordova-plugin-ionic-webview": "4.2.1",
    "cordova-plugin-splashscreen": "5.0.2",
    "cordova-plugin-statusbar": "2.4.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-sqlite-storage": "5.1.0",
    "onesignal-cordova-plugin": "3.3.1"
  };
});