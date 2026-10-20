/**
 * Whether a right-click should keep the webview's own menu: on an editable field (cut, copy, paste)
 * or over selected text (copy). Everywhere else the app shows its own menus or none.
 */
export const allowsNativeContextMenu = (target: EventTarget | null): boolean => {
  if (
    target instanceof Element &&
    target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')
  ) {
    return true;
  }

  return Boolean(window.getSelection()?.toString());
};
