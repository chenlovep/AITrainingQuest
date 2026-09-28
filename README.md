# AI Training Quest Android v1.2

Android app wrapper for AI Training Quest curriculum v1.6.

## Included
- Fully bundled offline HTML/CSS/JS curriculum
- Persistent XP/progress via WebView DOM storage
- Adaptive launcher icon and dark system bars
- Android back button mapped to in-app back navigation
- External http/https links open in the system browser
- Offline/local error fallback page
- Portrait phone layout

## Build in Android Studio
1. Open this folder in a recent Android Studio.
2. Let Gradle sync and install Android SDK 35 if requested.
3. Choose **Build > Build APK(s)** for an installable debug APK.
4. APK output: `app/build/outputs/apk/debug/app-debug.apk`.

## Release / Play Store
Use **Build > Generate Signed App Bundle or APK**. Choose Android App Bundle (AAB), create/select your signing key, then build the release bundle. Never commit your release keystore or passwords.

Application ID: `com.aitrainingquest.app`
Version: `1.2.0` (versionCode 12)
Minimum Android: 8.0 / API 26
Target/compile SDK: 35


## App v1.2
Today dashboard, daily quests, streak, level/XP profile, progress overview and achievement badges are now included.

## No-Android-Studio APK build
This project includes `.github/workflows/build-apk.yml`.

1. Create a GitHub repository and upload this project to its root.
2. Open the repository's **Actions** tab.
3. Choose **Build Android APK** and select **Run workflow**.
4. When the run finishes, open it and download the artifact named **AITrainingQuest-v1.2-APK**.
5. Unzip the artifact to get `AITrainingQuest-v1.2-debug.apk`, then install it on Android.

The workflow uses Java 17, Android API 35 / Build Tools 35.0.0, Gradle 8.9, and Android Gradle Plugin 8.7.3.
