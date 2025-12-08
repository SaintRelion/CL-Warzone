import { setAuthLibClientAppName } from "@saintrelion/auth-lib";
import {
  setDataAccessLayerClientAppName,
  setGlobalMode,
} from "@saintrelion/data-access-layer";

setAuthLibClientAppName("warzone");
setDataAccessLayerClientAppName("warzone");
setGlobalMode("firebase");
