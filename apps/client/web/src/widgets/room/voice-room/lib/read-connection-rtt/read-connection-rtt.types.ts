export type RttStatsSource = {
  getStats: () => Promise<RTCStatsReport> | undefined;
};
