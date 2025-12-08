import { useAuth, useLoginWithCredentials } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const loginWithCredentials = useLoginWithCredentials();

  const handleLogin = (data: Record<string, string>) => {
    loginWithCredentials.run(
      "emailAddress",
      data.emailAddress,
      data.password,
      setUser,
      (user) => {
        navigate(user.role == "admin" ? "/admin/" : "/");
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-center">
          <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
          <h1 className="ml-2 text-2xl font-bold text-gray-900">InternetPro</h1>
        </div>

        <RenderForm wrapperClass="space-y-4">
          <RenderFormField
            field={{
              label: "Email Address",
              type: "email",
              name: "emailAddress",
              placeholder: "your@gmail.com",
            }}
            labelClassName="mb-2 block text-sm font-medium text-gray-700"
            inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
          />
          <RenderFormField
            field={{
              label: "Password",
              type: "password",
              name: "password",
              placeholder: "••••••••",
            }}
            labelClassName="mb-2 block text-sm font-medium text-gray-700"
            inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
          />
          <RenderFormButton
            buttonLabel="Sign In"
            isDisabled={loginWithCredentials.isLocked}
            onSubmit={handleLogin}
            buttonClassName="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
          />
        </RenderForm>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <a
            href="/register"
            className="mt-1 font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
