import {
  useResourceLocked,
  type Paginated,
} from "@saintrelion/data-access-layer";
import AccountsTable from "@/components/accounts/AccountsTable";
import type { User } from "@/models/user";
import { useAccountsStore } from "@/stores/accounts/useAccountsStore";

const UserAccountsPage = () => {
  const currentPage = useAccountsStore((a) => a.currentPage);

  const { useList: getUserSubscribers } =
    useResourceLocked<Paginated<User>>("usersubscribers");
  const userSubscribers = getUserSubscribers({
    filters: { page: currentPage },
  }).data;

  const totalPages = userSubscribers
    ? Math.ceil(userSubscribers.count / 200)
    : 0;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Data Table */}
        {!userSubscribers ? (
          <div>Loading...</div>
        ) : (
          <AccountsTable
            users={userSubscribers.results}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
};
export default UserAccountsPage;
