import {
  setAuthAPIBaseUrl,
  setAuthLibClientAppName,
  setAuthMode,
} from "@saintrelion/auth-lib";
import {
  setDALClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

// AUTH-LIB
setAuthLibClientAppName("warzone");
setAuthAPIBaseUrl("http://127.0.0.1:8000/api/");
setAuthMode("firebase");

// DAL
setDALClientAppName("warzone");
setGlobalMode("firebase");
