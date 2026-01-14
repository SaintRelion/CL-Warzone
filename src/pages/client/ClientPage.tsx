import { type JSX } from "react";

const ClientPage = ({ children }: { children: JSX.Element }) => {
  return (
    <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
      <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
    </main>
  );
};

export default ClientPage;
