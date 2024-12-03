import OrgView from "./view";

export async function generateMetadata({
  params,
}: {
  params: { orgSlug: string };
}) {
  return {
    title: params.orgSlug,
    description: "123",
  };
}

export default function OrgPage() {
  return <OrgView />;
}
