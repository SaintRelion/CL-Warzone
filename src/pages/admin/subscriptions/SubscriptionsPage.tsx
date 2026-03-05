import type { UserSubscription } from "@/models/subscription";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import KPICard from "@/components/subscriptions/KPICard";
import SubscriptionsTable from "@/components/subscriptions/SubscriptionsTable";
import ViewSubscription from "@/components/subscriptions/ViewSubscription";
import EditSubscription from "@/components/subscriptions/EditSubscribption";

const SubscriptionsPage = () => {
  const { useList: getUserSubscriptions } =
    useResourceLocked<UserSubscription>("usersubscription");
  const userSubscriptions = getUserSubscriptions().data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats Cards */}
        <KPICard subscriptions={userSubscriptions} />

        {/* Data Table */}
        <SubscriptionsTable userSubscriptions={userSubscriptions} />

        {/* View Modal */}
        <ViewSubscription />

        {/* Edit Modal (Admin-only fields) */}
        <EditSubscription />
      </div>
    </div>
  );
};
export default SubscriptionsPage;
