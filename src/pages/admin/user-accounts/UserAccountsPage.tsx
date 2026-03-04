import { useResourceLocked } from "@saintrelion/data-access-layer";
import AccountsTable from "@/components/accounts/AccountsTable";
import type { User } from "@/models/user";

const UserAccountsPage = () => {
  const { useList: getUserSubscribers } =
    useResourceLocked<User>("usersubscribers");
  const userSubscribers = getUserSubscribers().data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Data Table */}
        <AccountsTable users={userSubscribers} />
      </div>
    </div>
  );
};
export default UserAccountsPage;
