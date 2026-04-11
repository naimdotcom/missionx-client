import Settings from "@/pages/settings/Settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/settings/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const slug = Route.useParams();

  const allowed = [
    "profile",
    "appearance",
    "media",
    "apps",
    "cx-solutions",
    "notifications",
    "security",
    "advanced",
  ];

  const initialTab =
    slug && allowed.includes(slug.slug) ? slug.slug : "profile";

  return <Settings initialTab={initialTab} />;
}
