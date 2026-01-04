import { DataTable } from "@/components/admin/DataTable";
import type { Subscription } from "@/models/Subscription";
import type { User } from "@/models/User";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import type { ColumnDef } from "@tanstack/react-table";
import { useState, useMemo } from "react";

const SubscribersPage = () => {
  // const { useSelect: usersSelect } = useDBOperationsLocked<User>("User");
  // const { data: users } = usersSelect();

  // const { useSelect: subscriptionsSelect } =
  //   useDBOperationsLocked<Subscription>("Subscription");
  // const { data: subscriptions } = subscriptionsSelect();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<(typeof mockSubscriptions)[0] | null>(null);
  const itemsPerPage = 20;

  const mockSubscriptions = [
    { id: 1, userId: "1", name: "Juan dela Cruz", planId: "2", balance: "500", address: "Katipunan", status: "Active", nextBillingDate: "January 2, 2026" },
    { id: 2, userId: "2", name: "Maria Santos", planId: "2", balance: "5000", address: "Makati", status: "Active", nextBillingDate: "January 5, 2026" },
    { id: 3, userId: "3", name: "Pedro Reyes", planId: "5", balance: "500", address: "Quezon City", status: "Suspended", nextBillingDate: "January 10, 2026" },
    { id: 4, userId: "4", name: "Ana Garcia", planId: "3", balance: "1200", address: "Pasig", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 5, userId: "5", name: "Carlos Mendoza", planId: "4", balance: "2500", address: "Cebu", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 6, userId: "6", name: "Lisa Tan", planId: "2", balance: "1500", address: "Manila", status: "Active", nextBillingDate: "January 3, 2026" },
    { id: 7, userId: "7", name: "Robert Santos", planId: "3", balance: "3000", address: "Davao", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 8, userId: "8", name: "Patricia Flores", planId: "5", balance: "500", address: "Iloilo", status: "Inactive", nextBillingDate: "January 15, 2026" },
    { id: 9, userId: "9", name: "Michael Torres", planId: "2", balance: "2100", address: "Zamboanga", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 10, userId: "10", name: "Jennifer Lopez", planId: "4", balance: "1800", address: "Cagayan de Oro", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 11, userId: "11", name: "David Reyes", planId: "2", balance: "999", address: "Bacolod", status: "Active", nextBillingDate: "January 6, 2026" },
    { id: 12, userId: "12", name: "Angela Martinez", planId: "3", balance: "1800", address: "Las Piñas", status: "Active", nextBillingDate: "January 4, 2026" },
    { id: 13, userId: "13", name: "Christopher Lee", planId: "5", balance: "2200", address: "Antipolo", status: "Active", nextBillingDate: "January 14, 2026" },
    { id: 14, userId: "14", name: "Michelle Kim", planId: "2", balance: "1500", address: "Taguig", status: "Suspended", nextBillingDate: "January 20, 2026" },
    { id: 15, userId: "15", name: "Daniel Cruz", planId: "4", balance: "3500", address: "Maynila", status: "Active", nextBillingDate: "January 13, 2026" },
    { id: 16, userId: "16", name: "Sarah Johnson", planId: "3", balance: "2000", address: "Quezon City", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 17, userId: "17", name: "Mark Wilson", planId: "2", balance: "1200", address: "Makati", status: "Active", nextBillingDate: "January 5, 2026" },
    { id: 18, userId: "18", name: "Jessica Brown", planId: "5", balance: "4000", address: "Pasay", status: "Active", nextBillingDate: "January 19, 2026" },
    { id: 19, userId: "19", name: "James Anderson", planId: "3", balance: "1500", address: "Mandaluyong", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 20, userId: "20", name: "Lauren Taylor", planId: "4", balance: "2800", address: "San Juan", status: "Inactive", nextBillingDate: "January 18, 2026" },
    { id: 21, userId: "21", name: "Thomas Moore", planId: "2", balance: "900", address: "Cainta", status: "Active", nextBillingDate: "January 6, 2026" },
    { id: 22, userId: "22", name: "Emily Davis", planId: "3", balance: "2100", address: "Valenzuela", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 23, userId: "23", name: "Andrew Jackson", planId: "5", balance: "3200", address: "Cavite", status: "Active", nextBillingDate: "January 16, 2026" },
    { id: 24, userId: "24", name: "Nancy White", planId: "2", balance: "1600", address: "Rizal", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 25, userId: "25", name: "Joseph Harris", planId: "4", balance: "2500", address: "Bulacan", status: "Suspended", nextBillingDate: "January 22, 2026" },
    { id: 26, userId: "26", name: "Karen Martin", planId: "3", balance: "1800", address: "Laguna", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 27, userId: "27", name: "Ryan Thompson", planId: "2", balance: "1100", address: "Batangas", status: "Active", nextBillingDate: "January 4, 2026" },
    { id: 28, userId: "28", name: "Lisa Garcia", planId: "5", balance: "3800", address: "Mindoro", status: "Active", nextBillingDate: "January 17, 2026" },
    { id: 29, userId: "29", name: "Kevin Martinez", planId: "3", balance: "2200", address: "Palawan", status: "Active", nextBillingDate: "January 10, 2026" },
    { id: 30, userId: "30", name: "Amanda Robinson", planId: "4", balance: "2900", address: "Siquijor", status: "Active", nextBillingDate: "January 14, 2026" },
    { id: 31, userId: "31", name: "Brandon Clark", planId: "2", balance: "1300", address: "Negros", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 32, userId: "32", name: "Megan Rodriguez", planId: "3", balance: "2000", address: "Panay", status: "Inactive", nextBillingDate: "January 21, 2026" },
    { id: 33, userId: "33", name: "Eric Lewis", planId: "5", balance: "3500", address: "Bicol", status: "Active", nextBillingDate: "January 15, 2026" },
    { id: 34, userId: "34", name: "Rebecca Lee", planId: "2", balance: "1400", address: "Camarines", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 35, userId: "35", name: "Steven Walker", planId: "4", balance: "2600", address: "Albay", status: "Active", nextBillingDate: "January 13, 2026" },
    { id: 36, userId: "36", name: "Samantha Hall", planId: "3", balance: "1900", address: "Sorsogon", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 37, userId: "37", name: "Matthew Allen", planId: "2", balance: "1500", address: "Catanduanes", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 38, userId: "38", name: "Stephanie Young", planId: "5", balance: "4200", address: "Nueva Ecija", status: "Active", nextBillingDate: "January 19, 2026" },
    { id: 39, userId: "39", name: "Jason King", planId: "3", balance: "2100", address: "Nueva Vizcaya", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 40, userId: "40", name: "Brenda Wright", planId: "4", balance: "2700", address: "Quirino", status: "Suspended", nextBillingDate: "January 25, 2026" },
    { id: 41, userId: "41", name: "Jeffrey Lopez", planId: "2", balance: "1200", address: "Aurora", status: "Active", nextBillingDate: "January 6, 2026" },
    { id: 42, userId: "42", name: "Deborah Hill", planId: "3", balance: "1950", address: "Tarlac", status: "Active", nextBillingDate: "January 10, 2026" },
    { id: 43, userId: "43", name: "Gary Scott", planId: "5", balance: "3600", address: "Pampanga", status: "Active", nextBillingDate: "January 16, 2026" },
    { id: 44, userId: "44", name: "Kimberly Green", planId: "2", balance: "1350", address: "Pangasinan", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 45, userId: "45", name: "Edward Adams", planId: "4", balance: "2800", address: "Benguet", status: "Active", nextBillingDate: "January 14, 2026" },
    { id: 46, userId: "46", name: "Donna Nelson", planId: "3", balance: "2050", address: "Ifugao", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 47, userId: "47", name: "Ronald Carter", planId: "2", balance: "1100", address: "Kalinga", status: "Active", nextBillingDate: "January 5, 2026" },
    { id: 48, userId: "48", name: "Jacqueline Mitchell", planId: "5", balance: "3900", address: "Apayao", status: "Inactive", nextBillingDate: "January 23, 2026" },
    { id: 49, userId: "49", name: "Steven Perez", planId: "3", balance: "2150", address: "Abra", status: "Active", nextBillingDate: "January 13, 2026" },
    { id: 50, userId: "50", name: "Carol Roberts", planId: "4", balance: "2900", address: "Ilocos", status: "Active", nextBillingDate: "January 15, 2026" },
    { id: 51, userId: "51", name: "Paul Phillips", planId: "2", balance: "1450", address: "La Union", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 52, userId: "52", name: "Janet Campbell", planId: "3", balance: "1850", address: "Dagupan", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 53, userId: "53", name: "Mark Parker", planId: "5", balance: "3700", address: "Vigan", status: "Active", nextBillingDate: "January 18, 2026" },
    { id: 54, userId: "54", name: "Maria Evans", planId: "2", balance: "1300", address: "Laoag", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 55, userId: "55", name: "Donald Edwards", planId: "4", balance: "2750", address: "Baguio", status: "Suspended", nextBillingDate: "January 24, 2026" },
    { id: 56, userId: "56", name: "Frances Collins", planId: "3", balance: "2000", address: "Tuguegarao", status: "Active", nextBillingDate: "January 10, 2026" },
    { id: 57, userId: "57", name: "Frank Stewart", planId: "2", balance: "1600", address: "Ilagan", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 58, userId: "58", name: "Ann Sanchez", planId: "5", balance: "4100", address: "Tabuk", status: "Active", nextBillingDate: "January 17, 2026" },
    { id: 59, userId: "59", name: "Patrick Morris", planId: "3", balance: "2250", address: "Cabanatuan", status: "Active", nextBillingDate: "January 14, 2026" },
    { id: 60, userId: "60", name: "Rose Rogers", planId: "4", balance: "2650", address: "Palayan", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 61, userId: "61", name: "Dennis Reed", planId: "2", balance: "1250", address: "San Fernando", status: "Active", nextBillingDate: "January 6, 2026" },
    { id: 62, userId: "62", name: "Diane Cook", planId: "3", balance: "1950", address: "Angeles", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 63, userId: "63", name: "Jerry Morgan", planId: "5", balance: "3400", address: "Gapan", status: "Inactive", nextBillingDate: "January 20, 2026" },
    { id: 64, userId: "64", name: "Barbara Bell", planId: "2", balance: "1500", address: "Orani", status: "Active", nextBillingDate: "January 5, 2026" },
    { id: 65, userId: "65", name: "Tom Murphy", planId: "4", balance: "2900", address: "Tarjac", status: "Active", nextBillingDate: "January 16, 2026" },
    { id: 66, userId: "66", name: "Gloria Bailey", planId: "3", balance: "2100", address: "Mabalacat", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 67, userId: "67", name: "Anthony Rivera", planId: "2", balance: "1350", address: "Floridablanca", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 68, userId: "68", name: "Carolyn Cooper", planId: "5", balance: "3800", address: "Santo Tomas", status: "Active", nextBillingDate: "January 19, 2026" },
    { id: 69, userId: "69", name: "Stephen Richardson", planId: "3", balance: "2000", address: "Manaoag", status: "Active", nextBillingDate: "January 10, 2026" },
    { id: 70, userId: "70", name: "Shirley Cox", planId: "4", balance: "2750", address: "Urdaneta", status: "Suspended", nextBillingDate: "January 26, 2026" },
    { id: 71, userId: "71", name: "Larry Howard", planId: "2", balance: "1200", address: "Dagupan", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 72, userId: "72", name: "Jean Ward", planId: "3", balance: "1900", address: "Alaminos", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 73, userId: "73", name: "Danny Peterson", planId: "5", balance: "3600", address: "Lingayen", status: "Active", nextBillingDate: "January 15, 2026" },
    { id: 74, userId: "74", name: "Frances Gray", planId: "2", balance: "1400", address: "Cabanatuan", status: "Active", nextBillingDate: "January 6, 2026" },
    { id: 75, userId: "75", name: "Samuel Ramirez", planId: "4", balance: "2800", address: "Caranglan", status: "Active", nextBillingDate: "January 13, 2026" },
    { id: 76, userId: "76", name: "Evelyn James", planId: "3", balance: "2050", address: "General Natividad", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 77, userId: "77", name: "Peter Watson", planId: "2", balance: "1550", address: "Guimba", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 78, userId: "78", name: "Judith Brooks", planId: "5", balance: "4000", address: "Talugtug", status: "Active", nextBillingDate: "January 18, 2026" },
    { id: 79, userId: "79", name: "Arthur Chavez", planId: "3", balance: "2150", address: "Maragondon", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 80, userId: "80", name: "Diane Kelly", planId: "4", balance: "2650", address: "Kawit", status: "Inactive", nextBillingDate: "January 22, 2026" },
    { id: 81, userId: "81", name: "Roger Sanders", planId: "2", balance: "1100", address: "Rosario", status: "Active", nextBillingDate: "January 5, 2026" },
    { id: 82, userId: "82", name: "Victoria Bennett", planId: "3", balance: "1850", address: "Silang", status: "Active", nextBillingDate: "January 10, 2026" },
    { id: 83, userId: "83", name: "Ralph Wood", planId: "5", balance: "3500", address: "Tagaytay", status: "Active", nextBillingDate: "January 16, 2026" },
    { id: 84, userId: "84", name: "Katherine Barnes", planId: "2", balance: "1300", address: "Imus", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 85, userId: "85", name: "Roy Ross", planId: "4", balance: "2900", address: "Bacoor", status: "Active", nextBillingDate: "January 14, 2026" },
    { id: 86, userId: "86", name: "Janet Henderson", planId: "3", balance: "2000", address: "Kawit", status: "Suspended", nextBillingDate: "January 23, 2026" },
    { id: 87, userId: "87", name: "Bruce Coleman", planId: "2", balance: "1450", address: "Rosario", status: "Active", nextBillingDate: "January 6, 2026" },
    { id: 88, userId: "88", name: "Diane Jenkins", planId: "5", balance: "3900", address: "Dasmariñas", status: "Active", nextBillingDate: "January 17, 2026" },
    { id: 89, userId: "89", name: "Jerry Perry", planId: "3", balance: "2100", address: "Naic", status: "Active", nextBillingDate: "January 11, 2026" },
    { id: 90, userId: "90", name: "Evelyn Powell", planId: "4", balance: "2750", address: "Trece Martires", status: "Active", nextBillingDate: "January 13, 2026" },
    { id: 91, userId: "91", name: "Alan Long", planId: "2", balance: "1250", address: "Kawit", status: "Active", nextBillingDate: "January 9, 2026" },
    { id: 92, userId: "92", name: "Diane Patterson", planId: "3", balance: "1950", address: "Basay", status: "Active", nextBillingDate: "January 12, 2026" },
    { id: 93, userId: "93", name: "Joe Hughes", planId: "5", balance: "3700", address: "Indang", status: "Inactive", nextBillingDate: "January 21, 2026" },
    { id: 94, userId: "94", name: "Brenda Flores", planId: "2", balance: "1600", address: "Noveleta", status: "Active", nextBillingDate: "January 7, 2026" },
    { id: 95, userId: "95", name: "Albert Washington", planId: "4", balance: "2600", address: "Pakil", status: "Active", nextBillingDate: "January 15, 2026" },
    { id: 96, userId: "96", name: "Gloria Butler", planId: "3", balance: "2050", address: "Paete", status: "Active", nextBillingDate: "January 10, 2026" },
    { id: 97, userId: "97", name: "Joe Simmons", planId: "2", balance: "1400", address: "Siniloan", status: "Active", nextBillingDate: "January 8, 2026" },
    { id: 98, userId: "98", name: "Sandra Foster", planId: "5", balance: "4100", address: "Lumban", status: "Active", nextBillingDate: "January 19, 2026" },
    { id: 99, userId: "99", name: "Claude Gonzales", planId: "3", balance: "2200", address: "Cavinti", status: "Active", nextBillingDate: "January 14, 2026" },
    { id: 100, userId: "100", name: "Betty Bryant", planId: "4", balance: "2850", address: "Majayjay", status: "Active", nextBillingDate: "January 12, 2026" },
  ];

  // Calculate stats
  const totalSubscribers = mockSubscriptions.length;
  const activeSubscribers = mockSubscriptions.filter(s => s.status === "Active").length;
  const totalBalance = mockSubscriptions.reduce((sum, s) => sum + parseFloat(s.balance), 0);

  // Filter by search term
  const filteredSubscriptions = useMemo(() => {
    let result = [...mockSubscriptions];
    
    if (searchTerm) {
      result = result.filter(
        (subscription) =>
          subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.planId.includes(searchTerm) ||
          subscription.id.toString().includes(searchTerm)
      );
    }
    
    return result;
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const subscriptionColumns: ColumnDef<(typeof mockSubscriptions)[number]>[] = [
    {
      accessorKey: "id",
      header: "No.",
      cell: ({ getValue }) => (
        <span className="font-semibold text-gray-900">#{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Subscriber Name",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-900">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "planId",
      header: "Plan",
      cell: ({ getValue }) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Plan {getValue<string>()}
        </span>
      ),
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
        const config = statusConfig[val as keyof typeof statusConfig] || statusConfig.Inactive;

        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "balance",
      header: (
        <div className="relative inline-flex items-center gap-1 cursor-help group">
          <span>Outstanding Balance</span>
          <span className="text-gray-400">ⓘ</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-50">
            Sum of unpaid balances from subscriber
          </div>
        </div>
      ),
      cell: ({ getValue }) => (
        <span className="font-semibold text-gray-900">₱{parseFloat(getValue<string>()).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
      ),
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
            <span className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded">⚠️ Invalid date</span>
          );
        }
        return (
          <span className="text-sm text-gray-700 font-medium">📅 {dateStr}</span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Subscribers</p>
                <p className="mt-2 text-3xl font-black text-blue-900">{totalSubscribers}</p>
              </div>
              <div className="text-4xl opacity-20">👥</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-md border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Active Subscribers</p>
                <p className="mt-2 text-3xl font-black text-green-900">{activeSubscribers}</p>
              </div>
              <div className="text-4xl opacity-20">✓</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-md border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Total Balance</p>
                <p className="mt-2 text-3xl font-black text-purple-900">₱{totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg">
          <DataTable
            type="Subribers"
            data={paginatedSubscriptions}
            columns={subscriptionColumns}
          />
        </div>

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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
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

        {/* DELETE CONFIRMATION MODAL */}
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
                Are you sure you want to deactivate the subscription for <strong>subscriber #{deleteTarget.id}</strong>? This action cannot be undone. The subscriber will lose access to their service.
              </p>

              <div className="mb-6 rounded-lg bg-gray-50 p-3 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Plan:</span> Plan {deleteTarget.planId} | <span className="font-semibold">Status:</span> {deleteTarget.status}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`✓ Subscription #${deleteTarget.id} has been deactivated.`);
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-all active:scale-95 shadow-md"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SubscribersPage;
