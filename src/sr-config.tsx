// import {
//   setAuthAPIBaseUrl,
//   setAuthLibClientAppName,
//   setAuthMode,
// } from "@saintrelion/auth-lib";
// import {
//   setDALApiBaseUrl,
//   setDALClientAppName,
//   setGlobalMode,
// } from "@saintrelion/data-access-layer";

// export const BASE_API = "https://api.warzonecafe.tech/";
// // export const BASE_API = "http://127.0.0.1:8000/";
// // AUTH-LIB
// setAuthLibClientAppName("warzone");
// setAuthAPIBaseUrl(`${BASE_API}api/auth/`);
// setAuthMode("api-jwt");

// // DAL
// setDALClientAppName("warzone");
// setDALApiBaseUrl(`${BASE_API}api/`);
// setGlobalMode("api");

import {
  setAuthAPIBaseUrl,
  setAuthLibClientAppName,
  setAuthMode,
} from "@saintrelion/auth-lib";

import {
  setDALApiBaseUrl,
  setDALClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

export const BASE_API = "https://api.warzonecafe.tech/";
// export const BASE_API = "http://127.0.0.1:8000/";

export function initializeServices() {
  // AUTH
  setAuthLibClientAppName("warzone");
  setAuthAPIBaseUrl(`${BASE_API}api/auth/`);
  setAuthMode("api-jwt");

  // DAL
  setDALClientAppName("warzone");
  setDALApiBaseUrl(`${BASE_API}api/`);
  setGlobalMode("api");
}