import { useState } from "react";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  serviceArea: string;
  preferredDate: string;
  preferredTime: string;
}

const AccountPage = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    serviceArea: "Metro Manila",
    preferredDate: "",
    preferredTime: "",
  });

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
        Account Information
      </h2>
      <p className="mb-8 text-gray-600">Your registration details</p>

      <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              First Name
            </h3>
            <p className="text-lg text-gray-900">{registerData.firstName}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Last Name
            </h3>
            <p className="text-lg text-gray-900">{registerData.lastName}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Email Address
            </h3>
            <p className="text-lg text-gray-900">{registerData.email}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </h3>
            <p className="text-lg text-gray-900">{registerData.phone}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Street Address
            </h3>
            <p className="text-lg text-gray-900">
              {registerData.streetAddress}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">City</h3>
            <p className="text-lg text-gray-900">{registerData.city}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">ZIP Code</h3>
            <p className="text-lg text-gray-900">{registerData.zipCode}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Service Area
            </h3>
            <p className="text-lg text-gray-900">{registerData.serviceArea}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Preferred Installation Date
            </h3>
            <p className="text-lg text-gray-900">
              {registerData.preferredDate || "Not set"}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Preferred Time Slot
            </h3>
            <p className="text-lg text-gray-900">
              {registerData.preferredTime || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountPage;
