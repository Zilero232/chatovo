package chatovo.app

import android.content.Context
import android.webkit.WebView
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.json.JSONObject

// `window.chatovoCall.postMessage(json)` from the web app starts and stops
// CallService. The object exists only on the app's own origin (`android:dev`
// serves from it too), and only the main frame is heard: embedded players must
// not reach the service.
object CallBridge {
  private const val JS_OBJECT = "chatovoCall"
  private val APP_ORIGINS = setOf("http://tauri.localhost", "https://tauri.localhost")

  fun attach(context: Context, webView: WebView) {
    if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
      return
    }

    val appContext = context.applicationContext

    WebViewCompat.addWebMessageListener(webView, JS_OBJECT, APP_ORIGINS) { _, message, _, isMainFrame, _ ->
      if (!isMainFrame) {
        return@addWebMessageListener
      }

      // An ArrayBuffer message throws from `data` on newer WebView versions.
      val data = runCatching { message.data }.getOrNull() ?: return@addWebMessageListener

      val payload = try {
        JSONObject(data)
      } catch (error: Exception) {
        return@addWebMessageListener
      }

      when (payload.optString("type")) {
        "start" -> CallService.start(
          appContext,
          title = payload.optString("title"),
          text = payload.optString("text"),
          channelName = payload.optString("channel")
        )
        "stop" -> CallService.stop(appContext)
      }
    }
  }
}
