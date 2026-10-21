package chatovo.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder

// Since Android 9 an app in the background records silence unless a foreground
// service holds the microphone; this one runs for as long as a call is connected
// and shows the ongoing-call notification Android requires for it.
class CallService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent != null && intent.action != ACTION_STOP) {
      lastTitle = intent.getStringExtra(EXTRA_TITLE).orEmpty().ifBlank { "Chatovo" }
      lastText = intent.getStringExtra(EXTRA_TEXT).orEmpty()
      lastChannel = intent.getStringExtra(EXTRA_CHANNEL).orEmpty().ifBlank { "Chatovo" }
    }

    val notification = buildNotification(lastTitle, lastText, lastChannel)

    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE)
      } else {
        startForeground(NOTIFICATION_ID, notification)
      }
    } catch (error: Exception) {
      // Android 14 refuses a microphone service without RECORD_AUDIO or from the
      // background; the call keeps working in the foreground without it.
      stopSelf()

      return START_NOT_STICKY
    }

    // A stop arrives through startForegroundService too: a service started that
    // way and stopped before it calls startForeground crashes the app.
    if (intent?.action == ACTION_STOP) {
      stopForeground(STOP_FOREGROUND_REMOVE)
      stopSelf()
    }

    return START_NOT_STICKY
  }

  private fun buildNotification(title: String, text: String, channelName: String): Notification {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.createNotificationChannel(
        NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_LOW)
      )
    }

    val openApp = PendingIntent.getActivity(
      this,
      0,
      Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Notification.Builder(this, CHANNEL_ID)
    } else {
      @Suppress("DEPRECATION")
      Notification.Builder(this)
    }

    return builder
      .setSmallIcon(R.drawable.ic_call_notification)
      .setContentTitle(title)
      .setContentText(text)
      .setContentIntent(openApp)
      .setCategory(Notification.CATEGORY_CALL)
      .setOngoing(true)
      .build()
  }

  companion object {
    private const val CHANNEL_ID = "active_call"
    private const val NOTIFICATION_ID = 4210
    private const val EXTRA_TITLE = "title"
    private const val EXTRA_TEXT = "text"
    private const val EXTRA_CHANNEL = "channel"
    private const val ACTION_STOP = "chatovo.app.CallService.STOP"

    private var isRunning = false
    private var lastTitle = "Chatovo"
    private var lastText = ""
    private var lastChannel = "Chatovo"

    fun start(context: Context, title: String, text: String, channelName: String) {
      val intent = Intent(context, CallService::class.java)
        .putExtra(EXTRA_TITLE, title)
        .putExtra(EXTRA_TEXT, text)
        .putExtra(EXTRA_CHANNEL, channelName)

      try {
        startCompat(context, intent)
        isRunning = true
      } catch (error: Exception) {
        // Starting from the background is not allowed on Android 12+; the next
        // `start` from the foreground brings the service up.
      }
    }

    fun stop(context: Context) {
      if (!isRunning) {
        return
      }

      isRunning = false

      try {
        startCompat(context, Intent(context, CallService::class.java).setAction(ACTION_STOP))
      } catch (error: Exception) {
        context.stopService(Intent(context, CallService::class.java))
      }
    }

    private fun startCompat(context: Context, intent: Intent) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
    }
  }
}
