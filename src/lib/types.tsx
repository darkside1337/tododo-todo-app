export interface TodoType {
  id?: string;
  body: string;
  status: "complete" | "incomplete";
}

export type filtersType = "complete" | "incomplete" | "all";
