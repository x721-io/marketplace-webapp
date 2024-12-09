import { ElementType, Element } from "@/components/PageBuilder/types";

export const elementTextOverBgMedia: Element = {
  type: ElementType.CONTAINER,
  textOverMedia: true,
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  height: "100%",
  styles: {
    position: "relative",
  },
  children: [
    {
      type: ElementType.CONTAINER,
      textOverMedia: true,
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      children: [
        {
          type: ElementType.IMAGE,
          textOverMedia: true,
          src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
          height: "686px",
        },
      ],
    },
    {
      type: ElementType.CONTAINER,
      textOverMedia: true,
      width: "100%",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      styles: {
        position: "absolute",
        top: 0,
        left: 0,
        padding: "40px",
      },
      children: [
        {
          type: ElementType.TEXT,
          contentType: "TITLE",
          text: {
            content: "This is a title",
            color: "#ffffff",
            fontSize: "26px",
            fontWeight: 700,
            textAlign: "center",
          },
        },
        {
          type: ElementType.TEXT,
          contentType: "DESCRIPTION",
          text: {
            content: "This is a description.",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 300,
            textAlign: "center",
          },
        },
      ],
    },
  ],
};
export const elementTextLeftMediaRight: Element = {
  type: ElementType.CONTAINER,
  background: "transparent",
  gap: true,
  isFlexDirection: true,
  flexDirection: "row",
  height: "500px",
  styles: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  children: [
    {
      type: ElementType.CONTAINER,
      responsive: true,
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
          responsive: true,
          background: "transparent",
          justifyContent: "center",
          flexDirection: "column",
          styles: {
            width: "100%",
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
              styles: {
                marginTop: "12px",
              },
            },
          ],
        },
      ],
    },
    {
      type: ElementType.CONTAINER,
      responsive: true,
      background: "transparent",
      styles: {
        width: "100%",
      },
      children: [
        {
          type: ElementType.CONTAINER,
          responsive: true,
          background: "transparent",
          styles: {
            width: "100%",
          },

          children: [
            {
              type: ElementType.VIDEO,
              src: "https://stream.mux.com/701ykhqj7byVeIl0002PlMz1cwQAfmcbfCMolJ54Hy6n1E/high.mp4",
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
};

export const elementTextRightMediaLeft: Element = {
  type: ElementType.CONTAINER,
  background: "transparent",
  gap: true,
  isFlexDirection: true,
  flexDirection: "row",
  height: "500px",
  styles: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  children: [
    {
      type: ElementType.CONTAINER,
      responsive: true,
      background: "transparent",
      styles: {
        width: "100%",
      },
      children: [
        {
          type: ElementType.CONTAINER,
          responsive: true,
          background: "transparent",
          styles: {
            width: "100%",
          },

          children: [
            {
              type: ElementType.VIDEO,
              src: "https://stream.mux.com/701ykhqj7byVeIl0002PlMz1cwQAfmcbfCMolJ54Hy6n1E/high.mp4",
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
    {
      type: ElementType.CONTAINER,
      responsive: true,
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
          responsive: true,
          background: "transparent",
          justifyContent: "center",
          flexDirection: "column",
          styles: {
            width: "100%",
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
              styles: {
                marginTop: "12px",
              },
            },
          ],
        },
      ],
    },
  ],
};

export const elementMediaOnly: Element = {
  type: ElementType.CONTAINER,
  mediaOnly: true,
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  children: [
    {
      type: ElementType.IMAGE,
      src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
      width: "100%",
      height: "686px",
    },
  ],
};

export const elementTextBlockOnly: Element = {
  type: ElementType.CONTAINER,
  width: "100%",
  height: "100%",
  textOnly: true,
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  children: [
    {
      type: ElementType.CONTAINER,
      width: "100%",
      height: "100%",
      // textOnly: true,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      styles: {
        position: "absolute",
        top: 0,
        left: 0,
      },
      children: [
        {
          type: ElementType.TEXT,
          contentType: "TITLE",
          text: {
            content: "This is a title",
            color: "#000000",
            fontSize: "26px",
            fontWeight: 700,
            textAlign: "center",
          },
        },
        {
          type: ElementType.TEXT,
          contentType: "DESCRIPTION",
          text: {
            content: "This is a description.",
            color: "#000000",
            fontSize: "18px",
            fontWeight: 300,
            textAlign: "center",
          },
        },
      ],
    },
  ],
};
