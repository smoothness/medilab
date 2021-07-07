import * as dayjs from 'dayjs';

export interface IBinnacle {
  id?: number;
  doctorCode?: string | null;
  date?: dayjs.Dayjs | null;
}

export class Binnacle implements IBinnacle {
  constructor(public id?: number, public doctorCode?: string | null, public date?: dayjs.Dayjs | null) {}
}

export function getBinnacleIdentifier(binnacle: IBinnacle): number | undefined {
  return binnacle.id;
}
