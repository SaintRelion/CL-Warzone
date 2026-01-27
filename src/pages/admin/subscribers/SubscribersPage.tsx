import { DataTable } from "@/components/admin/DataTable";
import type { ClientSubscription } from "@/models/Subscription";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import {
  formatReadableDate,
  formatReadableDateTime,
} from "@saintrelion/time-functions";
import type { ColumnDef } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Eye, Edit, MoreHorizontal, ToggleLeft, ServerCog } from "lucide-react";
import { useAuth } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";

const SubscribersPage = () => {
  const { useList: getSubscriptions, useUpdate: updateSubscription } =
    useResourceLocked<ClientSubscription, never, Partial<ClientSubscription>>(
      "subscription",
    );
  const subscriptions = getSubscriptions().data;
  const { useList: getUsers } = useResourceLocked<User>("user");
  const users = getUsers().data;
  const { useUpdate: updateUser } = useResourceLocked<never, never, User>(
    "user",
  );
  const { run: doUpdateUser } = updateUser;
  const usersById = (users || []).reduce<Record<string, User>>((acc, u) => {
    if (u?.id) acc[u.id] = u;
    return acc;
  }, {});
  // Debug: log a sample subscription shape to help diagnose missing fields
  if (typeof window !== "undefined") {
    // avoid noisy logs in SSR; only log when subscriptions change in browser
    // eslint-disable-next-line no-console
    console.debug("[SubscribersPage] sample subscription:", subscriptions[0]);
  }
  const { run: doUpdateSubscription, isLocked: isUpdating } =
    updateSubscription;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  // const [deleteTarget, setDeleteTarget] = useState(null);
  const itemsPerPage = 20;

  // Calculate stats
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter(
    (s) => s.status === "Active",
  ).length;
  const totalBalance = subscriptions.reduce(
    (sum, s) => sum + parseFloat(s.amount),
    0,
  );

  // Filter by search term
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (searchTerm) {
      result = result.filter(
        (subscription) =>
          subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subscription.planId.includes(searchTerm) ||
          subscription.id.toString().includes(searchTerm),
      );
    }

    return result;
  }, [subscriptions, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const subscriptionColumns: ColumnDef<ClientSubscription>[] = [
    {
      id: "name",
      header: "Subscriber Name",
      cell: ({ row }) => {
        const sub = row.original as any;

        const tryNames: Array<string | null | undefined> = [];

        // 1. explicit subscription name
        tryNames.push(sub.name);

        // 2. populated `user` object (server returns `user` from populateSubscription)
        const user =
          sub.user || (typeof sub.userId === "object" ? sub.userId : null);
        if (user) {
          // prefer first/last, then other common variants
          const first = user.firstName || user.first_name || user.first || null;
          const last = user.lastName || user.last_name || user.last || null;
          if (first || last)
            tryNames.push([first, last].filter(Boolean).join(" "));
          // fallback to email
          tryNames.push(user.emailAddress || user.email || user.username);
        }

        // 3. populated `userId` when it's an object with nested name fields (already covered),
        // or when userId is a plain string - try to resolve via users map
        if (typeof sub.userId === "string") {
          // strip leading colon or non-alphanumeric characters
          const cleanId = String(sub.userId).replace(/^[:\s]+/, "");
          const resolved = usersById[cleanId];
          if (resolved)
            tryNames.push(
              [resolved.firstName, resolved.lastName]
                .filter(Boolean)
                .join(" ") ||
                resolved.emailAddress ||
                resolved.email,
            );
          else tryNames.push(cleanId);
        }

        // 4. plan/customer fields sometimes used
        tryNames.push(sub.customer || sub.customerName);

        // 5. lastly, subscription id
        tryNames.push(sub.id || sub._id);

        const name =
          tryNames.find((v) => typeof v === "string" && v.trim() !== "") || "—";

        return (
          <span className="text-sm font-medium text-gray-900">{name}</span>
        );
      },
    },
    {
      accessorKey: "planId",
      header: "Plan",
      cell: ({ row }) => {
        const sub = row.original as any;
        const planName = sub.plan?.name || sub.planName || sub.planId;
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {planName ? `Plan ${planName}` : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        const statusConfig = {
          Active: { bg: "bg-green-100", text: "text-green-800" },
          Suspended: { bg: "bg-red-100", text: "text-red-800" },
          Inactive: { bg: "bg-gray-100", text: "text-gray-800" },
        };
        const config =
          statusConfig[val as keyof typeof statusConfig] ||
          statusConfig.Inactive;

        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
          >
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => (
        <div className="group relative inline-flex cursor-help items-center gap-1">
          <span>Outstanding Balance</span>
          <span className="text-gray-400">ⓘ</span>
          <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white group-hover:block">
            Sum of unpaid balances from subscriber
          </div>
        </div>
      ),
      cell: ({ row, getValue }) => {
        const sub = row.original as any;
        // server uses `balance` (number) while some client shapes use `amount`
        const raw =
          sub.balance !== undefined ? String(sub.balance) : getValue<string>();
        const num = parseFloat(raw as string) || 0;
        return (
          <span className="font-semibold text-gray-900">
            ₱{num.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">📍 {getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "nextBillingDate",
      header: "Next Billing",
      cell: ({ getValue }) => {
        const dateStr = getValue<string>();
        const isValidDate = !dateStr.includes("90") && !dateStr.includes("00");
        if (!isValidDate) {
          return (
            <span className="rounded bg-red-50 px-2 py-1 text-sm font-medium text-red-600">
              ⚠️ Invalid date
            </span>
          );
        }
        return (
          <span className="text-sm font-medium text-gray-700">
            📅 {formatReadableDate(dateStr)}
          </span>
        );
      },
    },
    // Actions column (custom)
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const sub = row.original as ClientSubscription;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              aria-label={`View subscriber ${sub.id}`}
              onClick={() => handleOpenView(sub)}
              className="rounded p-2 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>

            <button
              aria-label={`Edit subscriber ${sub.id}`}
              onClick={() => handleOpenEdit(sub)}
              className="rounded p-2 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>

            <div className="relative">
              <button
                aria-haspopup="menu"
                aria-label={`More actions for ${sub.id}`}
                onClick={(e) => toggleMoreMenu(e, sub.id)}
                className="rounded p-2 hover:bg-gray-50"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </button>
              {openMoreMenuId === sub.id && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg">
                  <ul className="py-2">
                    {/* Enable / Disable */}
                    {sub.status !== "Archived" && (
                      <li>
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <ToggleLeft className="h-4 w-4 text-gray-600" />
                          <span>
                            {sub.status === "Active" ? "Deactivate" : "Enable"}
                          </span>
                        </button>
                      </li>
                    )}

                    {/* Change Plan */}
                    {sub.status !== "Archived" && (
                      <li>
                        <button
                          onClick={() => handleChangePlan(sub)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <ServerCog className="h-4 w-4 text-gray-600" />
                          <span>Change Plan</span>
                        </button>
                      </li>
                    )}

                    {/* View-only actions: Enable/Disable and Change Plan remain */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  // Local UI state for actions and modals
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<ClientSubscription | null>(null);
  const [editName, setEditName] = useState<string>("");

  const auth = useAuth();

  function toggleMoreMenu(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setOpenMoreMenuId((cur) => (cur === id ? null : id));
  }

  function handleOpenView(sub: ClientSubscription) {
    setSelected(sub);
    setViewOpen(true);
    setOpenMoreMenuId(null);
  }

  function handleOpenEdit(sub: ClientSubscription) {
    setSelected(sub);
    // populate editable name from subscription or populated user or users map
    const subAny = sub as any;
    const userPop =
      subAny.user || (typeof subAny.userId === "object" ? subAny.userId : null);
    let nameVal = "";
    if (subAny.name && String(subAny.name).trim() !== "") nameVal = subAny.name;
    else if (userPop)
      nameVal =
        `${userPop.firstName || userPop.first_name || ""} ${userPop.lastName || userPop.last_name || ""}`.trim();
    else if (typeof subAny.userId === "string") {
      const id = String(subAny.userId).replace(/^[:\s]+/, "");
      const resolved = usersById[id];
      if (resolved)
        nameVal =
          `${resolved.firstName || ""} ${resolved.lastName || ""}`.trim();
    }
    if (!nameVal && subAny.customer) nameVal = subAny.customer;
    setEditName(nameVal);
    setEditOpen(true);
    setOpenMoreMenuId(null);
  }

  function handleToggleStatus(sub: ClientSubscription) {
    const newStatus = sub.status === "Active" ? "Deactivate" : "Active";
    setOpenMoreMenuId(null);
    (async () => {
      try {
        await doUpdateSubscription({
          id: sub.id,
          payload: { status: newStatus },
        });
        alert(`Subscriber #${sub.id} status updated to ${newStatus}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to update status for subscriber #${sub.id}`);
      }
    })();
  }

  function handleChangePlan(sub: ClientSubscription) {
    setOpenMoreMenuId(null);
    const newPlan = prompt("Enter new plan ID:", sub.planId);
    if (!newPlan || newPlan === sub.planId) return;
    (async () => {
      try {
        await doUpdateSubscription({
          id: sub.id,
          payload: { planId: newPlan },
        });
        alert(`Subscriber #${sub.id} plan changed to ${newPlan}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to change plan for subscriber #${sub.id}`);
      }
    })();
  }

  // Removed Reset Portal Credentials, View Connection Info, and Archive handlers per request

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Total Subscribers
                </p>
                <p className="mt-2 text-3xl font-black text-blue-900">
                  {totalSubscribers}
                </p>
              </div>
              <div className="text-4xl opacity-20">👥</div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Active Subscribers
                </p>
                <p className="mt-2 text-3xl font-black text-green-900">
                  {activeSubscribers}
                </p>
              </div>
              <div className="text-4xl opacity-20">✓</div>
            </div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                  Total Balance
                </p>
                <p className="mt-2 text-3xl font-black text-purple-900">
                  ₱
                  {totalBalance.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, user, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <DataTable
            type="Subcribers"
            data={paginatedSubscriptions}
            columns={subscriptionColumns}
            showDefaultActions={false}
            getRowId={(row) => row.id}
          />
        </div>

        {/* View Modal */}
        {viewOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold">Subscriber Overview</h2>
                <button
                  onClick={() => setViewOpen(false)}
                  aria-label="Close"
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Full name</p>
                  <p className="font-medium text-gray-900">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="font-medium text-gray-900">{selected.planId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">{selected.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">
                    {selected.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Outstanding balance</p>
                  <p className="font-medium text-gray-900">
                    ₱
                    {parseFloat(selected.amount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next billing</p>
                  <p className="font-medium text-gray-900">
                    {formatReadableDate(selected.nextBillingDate)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal (Admin-only fields) */}
        {editOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold">Edit Subscriber</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  aria-label="Close"
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const payload: Partial<ClientSubscription> = {
                    name: String(formData.get("name") || "").trim(),
                    address: String(formData.get("address") || "").trim(),
                    planId: String(formData.get("planId") || "").trim(),
                  };
                  const notes = String(formData.get("notes") || "").trim();
                  if (notes) (payload as any).notes = notes;

                  try {
                    // Update subscription fields
                    await doUpdateSubscription({ id: selected.id, payload });

                    // Update user name if changed and user exists
                    const formName = String(formData.get("name") || "").trim();
                    const sub = selected as any;
                    const user =
                      sub.user ||
                      (typeof sub.userId === "object" ? sub.userId : null);
                    if (formName && user) {
                      const existingName =
                        `${user.firstName || user.first_name || ""} ${user.lastName || user.last_name || ""}`.trim();
                      if (existingName !== formName) {
                        const parts = formName.split(/\s+/);
                        const firstName = parts.shift() || "";
                        const lastName = parts.join(" ") || "";
                        try {
                          await doUpdateUser({
                            id: user.id || user._id,
                            payload: { firstName, lastName } as any,
                          });
                        } catch (uerr) {
                          console.error("Failed to update user name", uerr);
                        }
                      }
                    }

                    alert(`Saved changes for subscriber #${selected.id}`);
                    setEditOpen(false);
                  } catch (err) {
                    console.error(err);
                    alert(
                      `Failed to save changes for subscriber #${selected.id}`,
                    );
                  }
                }}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500">Full name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    name="name"
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500">
                    Service address
                  </label>
                  <input
                    defaultValue={selected.address}
                    name="address"
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">Assigned plan</label>
                  <input
                    defaultValue={selected.planId}
                    name="planId"
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    Notes / remarks
                  </label>
                  <input
                    defaultValue={(selected as any).notes || ""}
                    name="notes"
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div className="mt-4 flex justify-end gap-3 sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded px-3 py-1 text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL
        {showDeleteModal && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-2xl">⚠️</span>
              </div>

              <h2 className="mb-2 text-xl font-black text-gray-900">
                Deactivate Subscription?
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to deactivate the subscription for{" "}
                <strong>subscriber #{deleteTarget.id}</strong>? This action
                cannot be undone. The subscriber will lose access to their
                service.
              </p>

              <div className="mb-6 rounded-lg bg-gray-50 p-3 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Plan:</span> Plan{" "}
                  {deleteTarget.planId} |{" "}
                  <span className="font-semibold">Status:</span>{" "}
                  {deleteTarget.status}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(
                      `✓ Subscription #${deleteTarget.id} has been deactivated.`,
                    );
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 active:scale-95"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
export default SubscribersPage;
