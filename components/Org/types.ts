export enum ElementType {
  CONTAINER = "CONTAINER",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  VIDEO = "VIDEO",
  BUTTON_LINK = "BUTTON_LINK",
  TEXT_LINK = "TEXT_LINK",
}

export type OrgProperties = {
  avatar: string;
  banner: string;
  title: string;
  description: string;
  overviewElements: Element[];
};

export type Element = Video | ButtonLink | TextLink | Container | Text | Image;

export type TextAttributes = {
  content: string;
  color: string;
  fontSize: string;
  fontWeight: number;
  styles?: React.CSSProperties;
  textAlign: "left" | "center" | "right";
};

export type Container = {
  type: ElementType.CONTAINER;
  width?: string;
  height?: string;
  background: string;
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
  path?: string;
};

export type Video = {
  type: ElementType.VIDEO;
  showControls?: boolean;
  src: string;
  width?: string;
  height?: string;
  styles?: React.CSSProperties;
  children?: Element[];
  path?: string;
};

export type Image = {
  type: ElementType.IMAGE;
  src: string;
  width?: string;
  height?: string;
  styles?: React.CSSProperties;
  children?: Element[];
  path?: string;
};

export type ButtonLink = {
  type: ElementType.BUTTON_LINK;
  href: string;
  text: TextAttributes;
  width?: string;
  height?: string;
  background?: string;
  styles?: React.CSSProperties;
  children?: Element[];
  path?: string;
};

export type TextLink = {
  type: ElementType.TEXT_LINK;
  href: string;
  text: TextAttributes;
  styles?: React.CSSProperties;
  children?: Element[];
  path?: string;
};

export type Text = {
  type: ElementType.TEXT;
  text: TextAttributes;
  contentType: "TITLE" | "DESCRIPTION";
  styles?: React.CSSProperties;
  children?: Element[];
  path?: string;
};
