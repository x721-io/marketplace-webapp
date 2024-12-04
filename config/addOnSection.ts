import { ElementType, Element } from "@/components/Org/types";

export const elementTextOverBgMedia: Element = {
  type: ElementType.CONTAINER,
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  height: "500px",
  styles: {
    position: "relative",
  },
  children: [
    {
      type: ElementType.CONTAINER,
      width: "100%",
      height: "600px",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      children: [
        {
          type: ElementType.IMAGE,
          src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
          height: "500px",
        },
      ],
    },
    {
      type: ElementType.CONTAINER,
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
};

export const elementTextRightMediaLeft: Element = {
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
  ],
};

export const elementMediaOnly: Element = {
  type: ElementType.CONTAINER,
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
  height: "400px",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  children: [
    {
      type: ElementType.CONTAINER,
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
