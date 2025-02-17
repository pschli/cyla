export interface Timeslot {
  time: string;
  duration: string;
  reserved: boolean;
  blocked: boolean;
  taken: boolean;
  appointment?:
    | {
        token: string | null;
        name?: string | undefined;
        email?: string | undefined;
      }
    | undefined;
}
