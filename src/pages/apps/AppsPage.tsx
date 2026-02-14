import { AppsTable } from "./components/AppsTable";
import { CreateAppDialog } from "./components/CreateAppDialog";

function AppsPage() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full gap-2 overflow-hidden ">
      {/* Header */}
      <div className="border-b px-4 md:px-6 py-1.5 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-md font-semibold">Apps</h1>
          <p className="text-sm text-muted-foreground">
            Manage your applications and their users.
          </p>
        </div>

        <CreateAppDialog />
      </div>

      <div className="overflow-y-auto px-4 md:px-6 ">
        <AppsTable />
      </div>
    </div>
  );
}

export default AppsPage;
