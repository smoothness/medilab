import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import {ILineComment, LineComment} from '../../entities/line-comment/line-comment.model';

@Component({
  selector: 'medi-payment-component',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() invoice: any;
  @Output() confirmPayment: EventEmitter<boolean> = new EventEmitter();

  public paymentData: any = null;
  public payPalConfig ?: IPayPalConfig;
  public showSuccess = false;
  public showCancel  = false;
  public showError  = false;

  get items(): ILineComment[] {
    this.invoice.lineComments.push(this.createTaxesLineComment());
    return <ILineComment[]>this.invoice.lineComments;
  }

  get itemsFormatted(): any[] {
    return Array.from(this.items, item => ({
      name: item.description,
      quantity: item.quantity,
      category: 'DIGITAL_GOODS',
      unit_amount: {
        currency_code: 'USD',
        value: item.unitPrice,
      },
    }))
  }

  ngOnInit(): void {
    this.initConfig();
  }

  protected createOrder(): ICreateOrderRequest {
    return {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: this.invoice.total,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: this.invoice.total
            }
          }
        },
        items: this.itemsFormatted
      }]
    }
  }

  protected onApprove(data: any, actions: any): void {
    actions.order.get();
  }

  protected onClientAuthorization(): void {
    this.confirmPayment.emit(true);
    this.showSuccess = true;
  }

  protected onCancel(): void {
    this.showCancel = true;

  }

  protected onError(): void{
  this.showError = true;
}

  protected onClick(): void {
    console.log("");
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'ATA6OKER_sFcfuVADH7TUG99zk7JaU1WK0NC-7KQ8XtiFHIl8xdBdfv3PdpK9hYr2QiO-I_1Uq1Hq3s4',
      createOrderOnClient: () => this.createOrder(),
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data: any, actions: any) => this.onApprove(data, actions),
      onClientAuthorization: () => this.onClientAuthorization(),
      onCancel: () => this.onCancel(),
      onError: () => this.onError(),
      onClick: () => this.onClick(),
    };
  }

  private createTaxesLineComment(): ILineComment{
    const taxesLine = new LineComment(undefined, 'Impuesto de venta', 1, this.invoice.taxes, this.invoice.id);
    return taxesLine;
  }

}

