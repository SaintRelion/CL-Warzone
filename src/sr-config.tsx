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

export const BASE_API = "127.0.0.1";
// AUTH-LIB
setAuthLibClientAppName("warzone");
setAuthAPIBaseUrl(`http://${BASE_API}:8000/api/auth/`);
setAuthMode("api-jwt");

// DAL
setDALClientAppName("warzone");
setDALApiBaseUrl(`http://${BASE_API}:8000/api/`);
setGlobalMode("api");
