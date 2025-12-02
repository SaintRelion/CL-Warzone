import { Save, X } from "lucide-react";

export type ModalField = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
};

interface ModalProps {
  type: string;
  modalMode: "add" | "edit";
  setShowModal: (show: boolean) => void;
}

const getFormFields = (type: string): ModalField[] => {
  switch (type) {
    case "subscribers":
      return [
        { name: "name", label: "Customer Name", type: "text" },
        {
          name: "plan",
          label: "Plan",
          type: "select",
          options: ["50 Mbps", "100 Mbps", "200 Mbps", "Enterprise"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Suspended", "Inactive"],
        },
        { name: "balance", label: "Balance", type: "number" },
        { name: "address", label: "Address", type: "text" },
      ];
    case "tickets":
      return [
        { name: "customer", label: "Customer", type: "text" },
        { name: "issue", label: "Issue", type: "text" },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          options: ["Low", "Medium", "High", "Critical"],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Open", "In Progress", "Resolved", "Closed"],
        },
        { name: "assignedTo", label: "Assigned To", type: "text" },
      ];
    default:
      return [];
  }
};

export const Modal = ({ type, modalMode, setShowModal }: ModalProps) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {modalMode === "add" ? "Add New" : "Edit"} {type.slice(0, -1)}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-4">
          {getFormFields(type).map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
