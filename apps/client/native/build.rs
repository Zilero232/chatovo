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
}
