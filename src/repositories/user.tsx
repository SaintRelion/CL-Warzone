import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";

// Firebase
firebaseRegister("User");

// API
apiRegister("User", "user");

// Mock
mockRegister<User>("User", []);
