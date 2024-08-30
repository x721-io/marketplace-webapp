import Text from "@/components/Text";
import { API_ENDPOINTS } from "@/config/api";
import { marketplaceApi } from "@/services/api";
import { Project } from "@/types";
import ProjectView from "./view";
import { Metadata } from "next";

const getProjectData = async (
  id: string
): Promise<
  { status: "success"; data: Project | null } | { status: "error" }
> => {
  try {
    const data = (await marketplaceApi.get(
      `${API_ENDPOINTS.LAUNCHPAD}/${id}`
    )) as Project | null;
    return {
      status: "success",
      data,
    };
  } catch (err) {
    return {
      status: "error",
    };
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const response = await getProjectData(params.id);
  if (response.status === "success" && response.data) {
    return {
      title: `${response.data.name} | X721`,
      openGraph: {
        images: [response.data.logo],
      },
    };
  }
  return {
    title: `Error | X721`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await getProjectData(params.id);

  if (response.status === "error") {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs" className="text-center">
          Network Error!
          <br />
          Please try again later
        </Text>
      </div>
    );
  }

  if (!response.data) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs">Project not found!</Text>
      </div>
    );
  }

  return <ProjectView data={response.data} />;
}
