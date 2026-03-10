import { useState } from "react";
import { useAuth, useCurrentUser } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";
import { apiRequest } from "@/pages/to-be-library/sr-api";
import { BASE_API } from "@/sr-config";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AccountPage = () => {
  const { refreshUser } = useAuth();
  const user = useCurrentUser<User>();

  const { useUpdate: updateUser } = useResourceLocked<never, never, User>(
    "user",
  );

  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const information: Record<string, string | undefined> = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    street_address: user.street_address,
    city_municipality: user.city_municipality,
    zip_code: user.zip_code,
    service_area: user.service_area,
  };

  const toSentenceCase = (text?: string) => {
    if (!text) return "—";

    return text
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
      .join(" ");
  };

  /** Handle personal info update (password excluded) */
  async function handleSubmit(data: Record<string, string>) {
    const payload: Record<string, string> = {};

    // Only include non-password fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "password") payload[key] = value;
    });

    const success = await updateUser.run({
      id: user.id,
      payload,
    });

    setEditMode(false);
    if (success) await refreshUser();
  }

  /** Handle password change via separate API */
  const [changingPassword, setChangingPassword] = useState(false);
  async function handleChangePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    setChangingPassword(true);
    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
    };
    try {
      await apiRequest(`${BASE_API}api/auth/change-password/`, payload, {
        method: "POST",
        auth: true, // user must be logged in
      });

      setShowPasswordModal(false);
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <>
      <RenderForm wrapperClassName="space-y-10 max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-linear-to-r from-indigo-50 to-purple-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Details
            </h3>

            <div className="flex gap-2">
              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
                  >
                    Change Password
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <RenderFormButton
                    onSubmit={handleSubmit}
                    isDisabled={updateUser.isLocked}
                    buttonLabel="Save"
                    buttonClassName="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
                  />

                  <button
                    disabled={updateUser.isLocked}
                    onClick={() => setEditMode(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
            {[
              { label: "First Name", name: "first_name" },
              { label: "Last Name", name: "last_name" },
              { label: "Email Address", name: "email" },
              { label: "Street Address", name: "street_address", full: true },
              { label: "Phone Number", name: "phone_number" },
              { label: "City / Municipality", name: "city_municipality" },
              { label: "ZIP Code", name: "zip_code" },
              { label: "Service Area", name: "service_area" },
            ].map((field) => (
              <div
                key={field.name}
                className={field.full ? "sm:col-span-2" : ""}
              >
                <p className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {field.label}
                </p>

                {!editMode ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-base text-gray-900">
                    {toSentenceCase(
                      information[
                        field.name as keyof typeof information
                      ] as string,
                    )}
                  </div>
                ) : (
                  <RenderFormField
                    field={{ name: field.name, type: "text" }}
                    defaultValue={
                      information[
                        field.name as keyof typeof information
                      ] as string
                    }
                    inputClassName="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </RenderForm>

      {/* ==============================
          Change Password Modal
      ============================== */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogTrigger asChild>
          <button
            className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </DialogTrigger>

        <DialogContent className="bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <RenderForm wrapperClassName="space-y-4">
            <RenderFormField
              field={{
                name: "current_password",
                label: "Current Password",
                type: "password",
              }}
              defaultValue=""
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
            <RenderFormField
              field={{
                name: "new_password",
                label: "New Password",
                type: "password",
              }}
              defaultValue=""
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-2"
            />

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={changingPassword}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <RenderFormButton
                onSubmit={(data) =>
                  handleChangePassword(data.current_password, data.new_password)
                }
                isDisabled={changingPassword}
                buttonLabel="Save"
                buttonClassName="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              />
            </DialogFooter>
          </RenderForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountPage;
