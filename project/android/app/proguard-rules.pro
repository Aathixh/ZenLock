# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

-keep class com.yourcompany.project.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.** { *; }
-keep class org.unimodules.** { *; }
-keep class expo.modules.** { *; }
-keep class com.swmansion.** { *; }
-keep class com.th3rdwave.** { *; }
-keep class com.reactnativecommunity.** { *; }
-keep class com.reactnative.** { *; }
-keep class com.wifi.** { *; }
-keep class com.asyncstorage.** { *; }