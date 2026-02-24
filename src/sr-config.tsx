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

// AUTH-LIB
setAuthLibClientAppName("warzone");
setAuthAPIBaseUrl("http://127.0.0.1:8000/api/auth/");
setAuthMode("api-jwt");

// DAL
setDALClientAppName("warzone");
setDALApiBaseUrl("http://127.0.0.1:8000/api/");
setGlobalMode("api");
