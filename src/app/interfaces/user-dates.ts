export interface UserDates {
  date: string;
  times: {
    time: string;
    duration: string;
    reserved: boolean;
    blocked: boolean;
    taken: boolean;
    appointment?: {
      token: string | null;
      name?: string;
      email?: string;
    };
  }[];
}
