import * as dayjs from 'dayjs';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { ILineComment } from 'app/entities/line-comment/line-comment.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IInvoice {
  id?: number;
  date?: dayjs.Dayjs;
  subtotal?: number | null;
  taxes?: number | null;
  discount?: number | null;
  total?: number | null;
  status?: Status | null;
  appointment?: IAppointment | null;
  lineComments?: ILineComment[] | null;
}

export class Invoice implements IInvoice {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public subtotal?: number | null,
    public taxes?: number | null,
    public discount?: number | null,
    public total?: number | null,
    public status?: Status | null,
    public appointment?: IAppointment | null,
    public lineComments?: ILineComment[] | null
  ) {}
}

export function getInvoiceIdentifier(invoice: IInvoice): number | undefined {
  return invoice.id;
}
