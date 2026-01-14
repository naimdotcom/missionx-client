import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const stats = [
    {
      label: "Profile",
      value: "Complete",
      description: "Your profile information",
    },
    {
      label: "Sessions",
      value: "View",
      description: "Active sessions and devices",
    },
    {
      label: "Security",
      value: "Manage",
      description: "Account security settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Welcome
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-neutral-200 dark:border-neutral-800"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {stat.value}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Navigate to common settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>• View and update your profile information</p>
              <p>• Manage active sessions</p>
              <p>• Review account security</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
            <CardDescription>Basic account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Member since
                </p>
                <p className="text-neutral-900 dark:text-neutral-50 font-medium">
                  January 2026
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Status</p>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
