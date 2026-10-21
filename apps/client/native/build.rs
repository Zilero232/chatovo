fn main() {
    tauri_build::build();

    tauri_utils::build::update_android_manifest(
        "WEBRTC PERMISSIONS",
        "manifest",
        [
            r#"<uses-permission android:name="android.permission.RECORD_AUDIO" />"#,
            r#"<uses-permission android:name="android.permission.CAMERA" />"#,
            r#"<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />"#,
        ]
        .join("\n    "),
    )
    .expect("failed to update AndroidManifest.xml for WebRTC");

    tauri_utils::build::update_android_manifest(
        "POST NOTIFICATIONS",
        "manifest",
        r#"<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />"#.to_string(),
    )
    .expect("failed to update AndroidManifest.xml for POST_NOTIFICATIONS");

    // CallService keeps the microphone alive in the background during a call.
    tauri_utils::build::update_android_manifest(
        "CALL SERVICE PERMISSIONS",
        "manifest",
        [
            r#"<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />"#,
            r#"<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />"#,
        ]
        .join("\n    "),
    )
    .expect("failed to update AndroidManifest.xml for the call service permissions");

    tauri_utils::build::update_android_manifest(
        "CALL SERVICE",
        "application",
        r#"<service android:name="chatovo.app.CallService" android:exported="false" android:foregroundServiceType="microphone" android:stopWithTask="true" />"#.to_string(),
    )
    .expect("failed to update AndroidManifest.xml for the call service");
}
