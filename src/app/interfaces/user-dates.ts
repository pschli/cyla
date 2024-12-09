export interface UserDates {
  date: string;
  times: {
    time: string;
    reserved: boolean;
    blocked: boolean;
    taken: boolean;
    appointment: {
      username: string;
      email: string;
    };
  }[];
}
