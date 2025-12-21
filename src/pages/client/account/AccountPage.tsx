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
    const success = await updateUser.run({
      userId: user.id,
      info: data,
      uniqueFields: ["emailAddress"],
    });

    setEditMode(false);
    if (success) await updateSession(data, setUser);
  }

  return (
    <RenderForm wrapperClass="space-y-10 max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Account Information
        </h2>
        <p className="text-gray-600">
          View and update your personal and contact details
        </p>
      </div>

      {/* ACCOUNT CARD */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        {/* Card Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Details
          </h3>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="rounded-lg border border-indigo-300 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
            >
              Edit
            </button>
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

        {/* Card Content */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email Address", name: "emailAddress" },
            { label: "Password", name: "passwordHash" },
            { label: "Street Address", name: "streetAddress", full: true },
             { label: "Phone Number", name: "phoneNumber" },
            { label: "City / Municipality", name: "city" },
            { label: "ZIP Code", name: "zipCode" },
            { label: "Service Area", name: "serviceArea" },
          ].map((field) => (
            <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                {field.label}
              </p>

              {!editMode ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-base text-gray-900">
                  {information[field.name] || "—"}
                </div>
              ) : (
                <RenderFormField
                  field={{ name: field.name, type: "text" }}
                  defaultValue={information[field.name]}
                  inputClassName="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h4 className="text-sm font-semibold text-red-700">
          Danger Zone
        </h4>
        <p className="mt-1 text-sm text-red-600">
          Deleting your account is permanent and cannot be undone.
        </p>

        <button className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </RenderForm>
  );
};

export default AccountPage;
