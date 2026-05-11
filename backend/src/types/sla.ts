export type SlaResult = {
  sla: number | string;
  status: string | null;
  note: string | null;
};

export type SlaResultMap = Map<string, SlaResult>;
