export type { TrayAction, TrayLabels, TrayState } from './api/tray-state';
export {
  INITIAL_TRAY_STATE,
  localizeTray,
  pushTrayState,
  subscribeTrayAction
} from './api/tray-state';
export { useCloseOnWindowEvent, useTrayBridge } from './model/hooks';
