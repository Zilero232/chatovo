package chatovo.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    intent?.let(::routePushTap)
    super.onCreate(savedInstanceState)
  }

  override fun onWebViewCreate(webView: WebView) {
    CallBridge.attach(this, webView)
  }

  override fun onNewIntent(intent: Intent) {
    routePushTap(intent)
    super.onNewIntent(intent)
  }

  // A tapped FCM notification starts the activity with its data payload as
  // extras, while the deep-link plugin only reads VIEW intents: move the
  // `link` field there so the client routes it like any chatovo:// link.
  private fun routePushTap(intent: Intent) {
    val link = intent.getStringExtra(PUSH_LINK_EXTRA) ?: return

    if (!link.startsWith("chatovo://")) {
      return
    }

    intent.action = Intent.ACTION_VIEW
    intent.data = Uri.parse(link)
    intent.removeExtra(PUSH_LINK_EXTRA)
  }

  private companion object {
    const val PUSH_LINK_EXTRA = "link"
  }
}
