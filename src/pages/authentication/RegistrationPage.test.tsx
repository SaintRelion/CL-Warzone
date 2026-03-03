import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./RegisterPage";

/* ----------------------------------
   AUTH MOCK (CONTROLLED + STABLE)
----------------------------------- */

let isLocked = false;

const mockRegister = vi.fn();

vi.mock("@saintrelion/auth-lib", () => ({
  useAuth: () => ({
    register: mockRegister,
    isLocked,
  }),
}));

/* ----------------------------------
   FORM MOCK (SIMPLIFIED RENDER)
----------------------------------- */

vi.mock("@saintrelion/forms", () => ({
  RenderForm: ({ children }: any) => <form>{children}</form>,
  RenderFormField: ({ field }: any) => (
    <input placeholder={field.placeholder || field.label} />
  ),
  RenderFormButton: ({ onSubmit, buttonLabel, isDisabled }: any) => (
    <button
      disabled={isDisabled}
      onClick={() =>
        onSubmit({
          first_name: "Juan",
          last_name: "Dela Cruz",
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

describe("RegisterPage (Production Level)", () => {
  beforeEach(() => {
    mockRegister.mockClear();
    isLocked = false;
  });

  /* 1️⃣ Rendering */

  it("renders heading and key form fields", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: "Create Account" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Juan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Dela Cruz")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  /* 2️⃣ Business Logic */

  it("calls auth.register with correct payload", async () => {
    render(<RegisterPage />);

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" })
    );

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });

    expect(mockRegister).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "Juan",
        last_name: "Dela Cruz",
        roles: ["client"], // 🔥 protected business rule
      }),
      "12345678"
    );
  });

  /* 3️⃣ Locked State */

  it("disables button when auth is locked", () => {
    isLocked = true;

    render(<RegisterPage />);

    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeDisabled();
  });

  /* 4️⃣ Failure Handling */

  it("still calls register when it fails (error path covered)", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Network Error"));

    render(<RegisterPage />);

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" })
    );

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });
  });
});