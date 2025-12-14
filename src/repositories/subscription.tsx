import type { Subscription } from "@/models/subscription";
import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("Subscription");

// API
apiRegister("Subscription", "subscription");

// Mock
mockRegister<Subscription>("Subscription", []);
