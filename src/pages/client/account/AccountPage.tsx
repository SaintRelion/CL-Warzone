import { useState } from "react";
import { updateSession, useAuth, useUpdateUser } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

const AccountPage = () => {
  const { user, setUser } = useAuth();

  const updateUser = useUpdateUser();

  const [editMode, setEditMode] = useState(false);
  const information: Record<string, string> = {
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    phoneNumber: user.phoneNumber,
    streetAddress: user.streetAddress,
    city: user.city,
    zipCode: user.zipCode,
    serviceArea: user.serviceArea,
  };

  async function handleSubmit(data: Record<string, string>) {
    const success = await updateUser.run({ userId: user.id, info: data });
    setEditMode(false);

    if (success) await updateSession(data, setUser);
  }

  return (
    <RenderForm wrapperClass="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Account Information
          </h2>
          <p className="mt-1 text-gray-600">
            Manage your personal and contact details
          </p>
        </div>

        {/* Edit / Save Buttons */}
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white shadow hover:bg-indigo-700"
          >
            Edit Information
          </button>
        ) : (
          <div className="flex gap-3">
            <RenderFormButton
              onSubmit={handleSubmit}
              isDisabled={updateUser.isLocked}
              buttonLabel="Save Changes"
              buttonClassName="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
            />
            <button
              disabled={updateUser.isLocked}
              onClick={() => {
                setEditMode(false);
              }}
              className="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {/* Info Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email Address", name: "emailAddress" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Street Address", name: "streetAddress", full: true },
            { label: "City", name: "city" },
            { label: "ZIP Code", name: "zipCode" },
            { label: "Service Area", name: "serviceArea" },
          ].map((field) => (
            <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
              <label className="mb-1.5 block text-sm font-semibold tracking-wide">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                  {field.label}
                </span>
              </label>

              {!editMode ? (
                <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-lg break-words text-gray-900 shadow-sm">
                  {information[field.name]}
                </p>
              ) : (
                <RenderFormField
                  field={{
                    name: field.name,
                    type: "text",
                  }}
                  defaultValue={information[field.name]}
                  inputClassName="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-md transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DELETE ACCOUNT */}
      <div className="border-t pt-6">
        <button className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white shadow hover:bg-red-700">
          Delete Account
        </button>
        <p className="mt-1 text-sm text-red-500">
          Warning: This action cannot be undone.
        </p>
      </div>
    </RenderForm>
  );
};

export default AccountPage;
