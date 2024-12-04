"use client";

import OrgHeader from "@/components/Org/order-header";
import OrgOverview from "@/components/Org/Overview/overview";
import { ElementType, OrgProperties } from "@/components/Org/types";
import Tab from "@/components/Org/Tab";
import { FormProvider, useForm } from "react-hook-form";

export const orgProperties: OrgProperties = {
  title: "Keepers",
  description:
    "Phasellus pharetra porta sodales. Quisque a felis neque. Vivamus sed vulputate ex. Donec ullamcorper pharetra efficitur. Donec faucibus sapien non tellus...",
  avatar:
    "https://i.seadn.io/gcs/files/76626ac2d98ce514f9ecf090a8b76109.png?auto=format&dpr=1&w=512",
  banner:
    "https://stream.mux.com/701ykhqj7byVeIl0002PlMz1cwQAfmcbfCMolJ54Hy6n1E/high.mp4",
  overviewElements: [
    {
      type: ElementType.CONTAINER,
      background: "transparent",
      height: "500px",
      styles: {
        width: "100%",
        // height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        padding: "40px 80px",
        gap: "80px",
      },
      children: [
        {
          type: ElementType.CONTAINER,
          background: "transparent",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          styles: {
            width: "100%",
            height: "100%",
          },
          children: [
            {
              type: ElementType.CONTAINER,
              background: "transparent",
              justifyContent: "center",
              flexDirection: "column",
              styles: {
                width: "100%",
                maxWidth: "600px",
              },
              children: [
                {
                  type: ElementType.TEXT,
                  contentType: "TITLE",
                  text: {
                    textAlign: "left",
                    content: "What is LayerG?",
                    color: "#252525",
                    fontSize: "26px",
                    fontWeight: 700,
                  },
                },
                {
                  type: ElementType.TEXT,
                  contentType: "DESCRIPTION",
                  text: {
                    textAlign: "left",
                    content:
                      "Few entities have shaken up the Web3 landscape as much as the NFT marketplace and aggregator Blur has in the last year. In November of 2022, it began to...",
                    color: "#6A6A6A",
                    fontSize: "18px",
                    fontWeight: 300,
                  },
                },
              ],
            },
          ],
        },
        {
          type: ElementType.CONTAINER,
          background: "transparent",
          styles: {
            width: "100%",
          },
          children: [
            {
              type: ElementType.CONTAINER,
              background: "transparent",
              styles: {
                width: "100%",
                maxWidth: "600px",
              },

              children: [
                {
                  type: ElementType.VIDEO,
                  src: "https://stream.mux.com/701ykhqj7byVeIl0002PlMz1cwQAfmcbfCMolJ54Hy6n1E/high.mp4",
                  showControls: false,
                  styles: {
                    objectFit: "cover",
                    aspectRatio: 1.5,
                    width: "100%",
                    height: "100%",
                    borderRadius: "16px",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// interface OrgViewState {
//   currTabIndex: number;
// }

export default function OrgView() {
  // const methods = useForm<OrgViewState>();

  // const { currTabIndex } = methods.watch();

  return (
    // <FormProvider {...methods}>
    <div className="w-full">
      <OrgHeader orgProperties={orgProperties} />
      <Tab />
    </div>
    // </FormProvider>
  );
}
