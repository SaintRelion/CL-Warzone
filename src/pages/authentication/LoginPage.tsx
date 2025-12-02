import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = (data: Record<string, string>) => {
    setUser({
      id: "1",
      role: data.sampleRole,
    });

    navigate(data.sampleRole == "admin" ? "/admin/" : "/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-center">
          <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
          <h1 className="ml-2 text-2xl font-bold text-gray-900">InternetPro</h1>
        </div>

        <RenderForm wrapperClass="space-y-4" onSubmit={handleLogin}>
          <RenderFormField
            field={{
              label: "Sample Role",
              type: "text",
              name: "sampleRole",
              placeholder: "client or admin",
            }}
            labelClassName="mb-2 block text-sm font-medium text-gray-700"
            inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
          />
          {/* <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
            />
          </div> */}
          <RenderFormButton
            buttonLabel="Sign In"
            buttonClass="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
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
