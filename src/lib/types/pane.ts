export type PaneId =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
  | "footer";

export interface PaneContent {
  id: string;
  component: any;
  title: string;
  props: any;
  closeable?: boolean;
}

export type PaneState = {
  [key in PaneId]: PaneContent | null;
};

export function isPaneId(value: any): value is PaneId {
  return [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomCenter",
    "bottomRight",
    "footer",
  ].includes(value);
}
