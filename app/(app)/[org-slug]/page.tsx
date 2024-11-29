"use client";

enum ElementType {
  CONTAINER = "CONTAINER",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  VIDEO = "VIDEO",
  BUTTON_LINK = "BUTTON_LINK",
  TEXT_LINK = "TEXT_LINK",
}

type Overview = {
  elements: Element[];
};

type Element = Video | ButtonLink | TextLink | Container | Text;

type TextAttributes = {
  content: string;
  color: string;
  fontSize: string;
  fontWeight: number;
  styles?: React.CSSProperties;
};

type Container = {
  type: ElementType.CONTAINER;
  width?: string;
  height?: string;
  background?: string;
  backgroundImage?: string;
  flexDirection?: "row" | "column";
  alignItems?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  children?: Element[];
  styles?: React.CSSProperties;
};

type Video = {
  type: ElementType.VIDEO;
  src: string;
  width?: string;
  height?: string;
  styles?: React.CSSProperties;
};

type ButtonLink = {
  type: ElementType.BUTTON_LINK;
  href: string;
  text: TextAttributes;
  width?: string;
  height?: string;
  background?: string;
  styles?: React.CSSProperties;
};

type TextLink = {
  type: ElementType.TEXT_LINK;
  href: string;
  text: TextAttributes;
  styles?: React.CSSProperties;
};

type Text = {
  type: ElementType.TEXT;
  text: TextAttributes;
  styles?: React.CSSProperties;
};

export const ContainerElement = (element: Container, index: number) => {
  return (
    <div
      key={index}
      style={{
        width: element.width ?? "100%",
        height: element.height ?? "auto",
        background: element.background,
        backgroundImage: element.backgroundImage
          ? `url("${element.backgroundImage}")`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flexDirection: element.flexDirection,
        alignItems: element.alignItems,
        justifyContent: element.justifyContent,
        display: "flex",
        flexWrap: "nowrap",
        ...element.styles,
      }}
    >
      {element.children &&
        element.children.map((e, i) => generateElement(e, i))}
    </div>
  );
};

export const TextElement = (element: Text, index: number) => {
  return (
    <p
      key={index}
      style={{
        color: element.text.color,
        fontSize: element.text.fontSize,
        fontWeight: element.text.fontWeight,
      }}
    >
      {element.text.content}
    </p>
  );
};

export const ButtonLinkElement = (element: ButtonLink, index: number) => {
  return (
    <button
      onClick={() => window.open(element.href, "_blank")}
      key={index}
      style={{
        color: element.text.color,
        fontSize: element.text.fontSize,
        fontWeight: element.text.fontWeight,
        width: element.width,
        height: element.height,
        background: element.background,
        ...element.styles,
      }}
    >
      {element.text.content}
    </button>
  );
};

export const VideoElement = (element: Video, index: number) => {
  return (
    <video
      key={index}
      loop
      muted
      autoPlay
      controls
      src={element.src}
      width={element.width}
      height={element.height}
      style={{
        background: "black",
        ...element.styles,
      }}
    ></video>
  );
};

export const generateElement = (element: Element, index: number) => {
  switch (element.type) {
    case ElementType.CONTAINER:
      return ContainerElement(element, index);
    case ElementType.BUTTON_LINK:
      return ButtonLinkElement(element, index);
    case ElementType.TEXT:
      return TextElement(element, index);
    case ElementType.VIDEO:
      return VideoElement(element, index);
  }
};

const overview: Overview = {
  elements: [
    {
      type: ElementType.CONTAINER,
      width: "100%",
      background: "rgba(0,0,0,0.95)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      children: [
        {
          type: ElementType.CONTAINER,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          styles: {
            flex: 1,
            paddingLeft: "100px",
            paddingRight: "100px",
            gap: "10px",
          },
          children: [
            {
              type: ElementType.TEXT,
              text: {
                content: "At the Cornerstone of Digital Identity",
                color: "white",
                fontSize: "26px",
                fontWeight: 700,
              },
            },
            {
              type: ElementType.TEXT,
              text: {
                content:
                  "Each Keeper is a fully-rigged and gameplay-ready 3D identity. Downloadable digital files make each avatar ready for use in 4K film and media, AAA gaming, and networked metaverse environments.",
                color: "rgba(255,255,255,0.7)",
                fontSize: "18px",
                fontWeight: 300,
              },
            },
            {
              type: ElementType.TEXT,
              text: {
                content:
                  "For example, a given Keeper can lead in a movie, TV, or web series, sign to a talent agency, feature as a playable character in an upcoming gaming franchise, and be represented commercially on physical and digital merchandise for that Keeper’s fanbase, among other applications spanning physical and digital worlds.",
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
              styles: {
                aspectRatio: 1,
                borderRadius: "20px",
              },
            },
          ],
        },
      ],
    },
    {
      type: ElementType.CONTAINER,
      width: "100%",
      background: "rgba(0,0,0,0.95)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      children: [
        {
          type: ElementType.CONTAINER,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          styles: {
            flex: 1,
            paddingLeft: "100px",
            paddingRight: "100px",
            gap: "10px",
          },
          children: [
            {
              type: ElementType.TEXT,
              text: {
                content: "At the Cornerstone of Digital Identity",
                color: "white",
                fontSize: "26px",
                fontWeight: 700,
              },
            },
            {
              type: ElementType.TEXT,
              text: {
                content:
                  "Each Keeper is a fully-rigged and gameplay-ready 3D identity. Downloadable digital files make each avatar ready for use in 4K film and media, AAA gaming, and networked metaverse environments.",
                color: "rgba(255,255,255,0.7)",
                fontSize: "18px",
                fontWeight: 300,
              },
            },
            {
              type: ElementType.TEXT,
              text: {
                content:
                  "For example, a given Keeper can lead in a movie, TV, or web series, sign to a talent agency, feature as a playable character in an upcoming gaming franchise, and be represented commercially on physical and digital merchandise for that Keeper’s fanbase, among other applications spanning physical and digital worlds.",
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

export default function LaygerG() {
  return (
    <div className="w-full">
      {overview.elements.map((e, i) => generateElement(e, i))}
    </div>
  );
}
