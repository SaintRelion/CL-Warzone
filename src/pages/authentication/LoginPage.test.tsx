import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";

/* ----------------------------------
   MOCKS
----------------------------------- */

let isTrusted = true;
let otpSent = false;

const mockLogin = vi.fn();
const mockApiRequest = vi.fn();

vi.mock("@saintrelion/auth-lib", () => ({
  useAuth: () => ({
    login: mockLogin,
    deviceId: "device-123",
  }),
}));

vi.mock("@/sr-config", () => ({
  BASE_API: "http://test/",
}));

vi.mock("../to-be-library/sr-api", () => ({
  apiRequest: (...args: any[]) => mockApiRequest(...args),
}));

vi.mock("@saintrelion/data-access-layer", () => ({
  useResourceLocked: () => ({
    useList: () => ({
      data: [
        {
          id: 1,
          name: "Basic Fiber",
          price: 999,
          speed_mbps: 100,
          description: "Basic Plan",
        },
      ],
    }),
  }),
}));

vi.mock("@saintrelion/notifications", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("@/components/authentication/OtpVerificaction", () => ({
  default: () => <div>OTP COMPONENT</div>,
}));

vi.mock("@saintrelion/forms", () => ({
  RenderForm: ({ children }: any) => <form>{children}</form>,
  RenderFormField: ({ field }: any) => (
    <input placeholder={field.placeholder} />
  ),
  RenderFormButton: ({ onSubmit, buttonLabel }: any) => (
    <button
      onClick={() =>
        onSubmit({
          email: "test@gmail.com",
          password: "12345678",
        })
      }
    >
      {buttonLabel}
    </button>
  ),
}));

/* ----------------------------------
   TEST SUITE
----------------------------------- */

describe("LoginPage (Full Flow)", () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockApiRequest.mockClear();
  });

  it("renders plans", () => {
    render(<LoginPage />);
    expect(screen.getByText("Basic Fiber")).toBeInTheDocument();
  });

  it("opens login modal", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("logs in directly when device is trusted", async () => {
    mockApiRequest.mockResolvedValueOnce({ is_trusted: true });

    render(<LoginPage />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });

  it("sends OTP when device is NOT trusted", async () => {
    mockApiRequest
      .mockResolvedValueOnce({ is_trusted: false }) // checkDevice
      .mockResolvedValueOnce({ otp_id: "123", expires_at: "2025" }); // sendOTP

    render(<LoginPage />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledTimes(2);
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });
});