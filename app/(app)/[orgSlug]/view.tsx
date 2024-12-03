"use client";

import OrgHeader from "@/components/Org/order-header";
import OrgOverview from "@/components/Org/Overview/overview";
import { ElementType, OrgProperties } from "@/components/Org/types";

const orgProperties: OrgProperties = {
  title: "Keepers",
  description: "Your Digital Identity",
  avatar:
    "https://i.seadn.io/gcs/files/76626ac2d98ce514f9ecf090a8b76109.png?auto=format&dpr=1&w=512",
  banner:
    "https://stream.mux.com/701ykhqj7byVeIl0002PlMz1cwQAfmcbfCMolJ54Hy6n1E/high.mp4",
  overviewElements: [
    {
      type: ElementType.CONTAINER,
      width: "100%",
      background: "rgba(0,0,0,0.95)",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      styles: {
        padding: "20px 0px",
      },
      children: [
        {
          type: ElementType.CONTAINER,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          styles: {
            width: "50%",
            paddingLeft: "100px",
            paddingRight: "100px",
            gap: "10px",
            alignSelf: "stretch",
          },
          children: [
            {
              type: ElementType.TEXT,
              contentType: "TITLE",
              text: {
                content: "At the Cornerstone of Digital Identity",
                color: "white",
                fontSize: "26px",
                fontWeight: 700,
              },
            },
            {
              type: ElementType.TEXT,
              contentType: "DESCRIPTION",
              text: {
                content:
                  "Each Keeper is a fully-rigged and gameplay-ready 3D identity. Downloadable digital files make each avatar ready for use in 4K film and media, AAA gaming, and networked metaverse environments.",
                color: "rgba(255,255,255,0.7)",
                fontSize: "18px",
                fontWeight: 300,
              },
            },
          ],
        },
        {
          type: ElementType.CONTAINER,
          width: "50%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          children: [
            {
              type: ElementType.VIDEO,
              src: "https://stream.mux.com/701ykhqj7byVeIl0002PlMz1cwQAfmcbfCMolJ54Hy6n1E/high.mp4",
              width: "500px",
              showControls: true,
              styles: {
                aspectRatio: 1,
                borderRadius: "20px",
              },
            },
          ],
        },
      ],
    },
  ],
};

export default function OrgView() {
  return (
    <div className="w-full">
      <OrgHeader orgProperties={orgProperties} />
      <OrgOverview overviewElements={orgProperties.overviewElements} />
    </div>
  );
}
