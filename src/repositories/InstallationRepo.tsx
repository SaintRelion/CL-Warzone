import type { Installation } from "@/models/Installation";
import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("Installation");

// API
apiRegister("Installation", "installation");

// Mock
mockRegister<Installation>("Installation", []);
