// @ts-nocheck
// lib/config/paneConfig.js
//sample config
export const paneConfigurations = {
  "/dashboard": {
    pane1: () =>
      import("../../routes/dashboard/components/DashboardPane1.svelte"),
    pane2: () =>
      import("../../routes/dashboard/components/DashboardPane2.svelte"),
  },
  "/analytics": {
    pane1: () =>
      import("../../routes/analytics/components/AnalyticsPane1.svelte"),
    pane2: () =>
      import("../../routes/analytics/components/AnalyticsPane2.svelte"),
  },
};
