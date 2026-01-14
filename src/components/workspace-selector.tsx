"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAppsQuery } from "@/store/api";
import { useDispatch } from "react-redux";
import { setSelectedApp } from "@/store/appSlice";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceSelector() {
  const { data: appsData, isLoading } = useGetAppsQuery({});
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelect = (app: any) => {
    dispatch(setSelectedApp(app));
    localStorage.setItem("selectedApp", JSON.stringify(app));
    router.push("/dashboard");
  };

  const handleCreateNew = () => {
    router.push("/apps/new");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-[#0C0C0C] text-zinc-400">
          <CardHeader className="pb-4">
            <Skeleton className="h-4 w-1/2 bg-zinc-800" />
            <Skeleton className="h-3 w-1/3 mt-2 bg-zinc-800" />
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-8 space-y-4">
            <Skeleton className="h-10 w-full bg-zinc-800" />
            <Skeleton className="h-10 w-full bg-zinc-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const apps = appsData?.apps || [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-[#0C0C0C] text-zinc-400">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-zinc-100">
            Select Workspace
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Select an organization to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center pt-6 pb-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">
            Select Workspace
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Choose an app to continue
          </p>

          <div className="w-full space-y-2">
            {apps.length > 0 ? (
              apps.map((app: any) => (
                <Button
                  key={app.id}
                  variant="ghost"
                  onClick={() => handleSelect(app)}
                  className="w-full justify-start h-12 px-4 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300 font-normal transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100">
                      {app.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{app.name}</span>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-zinc-500 mb-4">
                  You don't have any apps yet.
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                >
                  Create Your First App
                </Button>
              </div>
            )}

            {apps.length > 0 && (
              <Button
                variant="link"
                onClick={handleCreateNew}
                className="w-full text-xs text-zinc-500 hover:text-zinc-100 mt-4"
              >
                + Create new workspace
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
