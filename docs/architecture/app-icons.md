# App icons

Every native icon is generated from SVG sources in [apps/client/web/assets/icons/](../../apps/client/web/assets/icons/) by [apps/client/native/scripts/icons/generate.ts](../../apps/client/native/scripts/icons/generate.ts) (`bun tauri:icon`, also run by `predev`, `build` and every `android:*` script). `apps/client/native/icons/` is gitignored output — edit the SVGs, never the PNGs.

## Sources

| SVG | Becomes | Why it is separate |
| --- | --- | --- |
| `app-icon.svg` | Windows `.ico`, Linux PNGs, legacy Android launcher | The plaque fills the whole canvas, like Discord or Telegram: Windows draws icons edge to edge, and the old 76 % plaque looked a size smaller than its neighbours on the taskbar |
| `app-icon-macos.svg` | `icons/macos/icon.icns` (`tauri.macos.conf.json` replaces the whole `bundle.icon` list) | macOS expects the 824/1024 grid (80.47 %) with a 22.5 % corner radius; a full-bleed icon looks oversized in the Dock |
| `app-icon-bg.svg` + `app-icon-fg.svg` | Android adaptive icon | The cat sits in the 66 dp safe zone of the 108 dp layer — the logo must be 48–66 dp, so it is scaled to fit the circle mask without clipping the ears |
| `app-icon-mono.svg` | Android themed icon (`<monochrome>`, Android 13+) | A silhouette with the face cut out; the launcher tints it |
| `tray-icon.svg` | Windows and Linux tray | No plaque: the cat fills the frame, with a dark outline so it reads on both light and dark taskbars |
| `tray-icon-template.svg` | macOS menu bar | A template image — black plus alpha — so macOS tints it for the menu bar's appearance |

## Sizes

- **`.ico`** — 16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 128, 256: every size Windows requests across 100–400 % scaling ([Microsoft: icon construction](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-construction)). Tauri's own `.ico` carries only six, so at 125 % and 150 % Windows resampled a neighbouring size. `tauri icon --png` renders the PNGs and `png-to-ico` packs them.
- **Tray** — 16, 20, 24, 32, 40, 48, 64 (the notification area at 100–400 %). `tray_menu.rs` picks the one matching the primary monitor's scale at startup instead of handing Windows one bitmap to resample.
- **macOS tray** — 36 px (the menu bar draws it 18 pt tall), set with `icon_as_template`.

The window icon is linked into the binary — after changing a source, rebuild rather than restart `tauri:dev`; Windows may also keep the old one in its icon cache.
