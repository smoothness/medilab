import { IInvoice } from 'app/entities/invoice/invoice.model';

export interface ILineComment {
  id?: number;
  description?: string | null;
  quantity?: number ;
  unitPrice?: number ;
  invoiceCode?: IInvoice  | null;
}

export class LineComment implements ILineComment {
  constructor(
    public id?: number,
    public description?: string | null,
    public quantity?: number,
    public unitPrice?: number,
    public invoiceCode?: IInvoice  | null
  ) {}
}

export function getLineCommentIdentifier(lineComment: ILineComment): number | undefined {
  return lineComment.id;
}
