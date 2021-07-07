import { IInvoice } from 'app/entities/invoice/invoice.model';

export interface ILineComment {
  id?: number;
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  invoiceCode?: IInvoice | null;
}

export class LineComment implements ILineComment {
  constructor(
    public id?: number,
    public description?: string | null,
    public quantity?: number | null,
    public unitPrice?: number | null,
    public invoiceCode?: IInvoice | null
  ) {}
}

export function getLineCommentIdentifier(lineComment: ILineComment): number | undefined {
  return lineComment.id;
}
