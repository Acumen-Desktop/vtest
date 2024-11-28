export interface FileNode {
  name: string;
  type: "file" | "directory";
  expanded?: boolean;
  children?: FileNode[];
}
