import type { PaymentHistory } from "@/models/PaymentHistory";
import {
  firebaseRegister,
  apiRegister,
  mockRegister,
} from "@saintrelion/data-access-layer";

// Firebase
firebaseRegister("PaymentHistory");

// API
apiRegister("PaymentHistory", "paymenthistory");

// Mock
mockRegister<PaymentHistory>("PaymentHistory", []);
