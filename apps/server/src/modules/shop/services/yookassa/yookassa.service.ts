import { formatRubAmount, SHOP_ORDER_QUERY_PARAM } from '@chatovo/schemas';
import { Injectable, Logger } from '@nestjs/common';

import type { YookassaPayment, YookassaRefund } from '../../lib';
import type { CreatePaymentInput, YookassaRequestInput } from '../shop.service.types';

import { AppForbiddenException, AppInternalException } from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import {
  PAYMENT_DESCRIPTION_PREFIX,
  RECEIPT_VAT_CODE,
  YOOKASSA_API_URL,
  YOOKASSA_CURRENCY,
  YOOKASSA_TIMEOUT_MS
} from '../../config';
import { parseYookassaPayment, parseYookassaRefund } from '../../lib';

@Injectable()
export class YookassaService {
  private readonly logger = new Logger(YookassaService.name);

  constructor(private readonly config: AppConfigService) {}

  isEnabled(): boolean {
    return Boolean(this.config.get('YOOKASSA_SHOP_ID') && this.config.get('YOOKASSA_SECRET_KEY'));
  }

  private authorization(): string {
    const shopId = this.config.get('YOOKASSA_SHOP_ID');
    const secretKey = this.config.get('YOOKASSA_SECRET_KEY');

    if (!shopId || !secretKey) {
      throw new AppForbiddenException('SHOP_DISABLED', 'Shop is disabled');
    }

    return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`;
  }

  private async request({
    path,
    method,
    idempotenceKey,
    body
  }: YookassaRequestInput): Promise<unknown> {
    const headers: Record<string, string> = {
      Authorization: this.authorization(),
      'Content-Type': 'application/json'
    };

    if (idempotenceKey) {
      headers['Idempotence-Key'] = idempotenceKey;
    }

    const response = await fetch(`${YOOKASSA_API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(YOOKASSA_TIMEOUT_MS)
    }).catch((error: unknown) => {
      this.logger.warn(`YooKassa ${method} ${path} failed: ${String(error)}`);

      throw new AppInternalException('PAYMENT_PROVIDER_FAILED', 'Payment provider unavailable');
    });

    if (!response.ok) {
      this.logger.warn(`YooKassa ${method} ${path} answered ${response.status}`);

      throw new AppInternalException('PAYMENT_PROVIDER_FAILED', 'Payment provider rejected');
    }

    return response.json();
  }

  async createPayment({
    orderId,
    productKey,
    amountRub,
    customerEmail
  }: CreatePaymentInput): Promise<YookassaPayment> {
    const amount = { value: formatRubAmount(amountRub), currency: YOOKASSA_CURRENCY };
    const description = `${PAYMENT_DESCRIPTION_PREFIX}: ${productKey}`;
    const returnUrl = new URL(this.config.get('YOOKASSA_RETURN_URL'));

    returnUrl.searchParams.set(SHOP_ORDER_QUERY_PARAM, orderId);

    const receipt = this.config.get('YOOKASSA_SEND_RECEIPT')
      ? {
          customer: { email: customerEmail },
          items: [
            {
              description,
              quantity: '1.00',
              amount,
              vat_code: RECEIPT_VAT_CODE,
              payment_mode: 'full_payment',
              payment_subject: 'service'
            }
          ]
        }
      : undefined;

    const payload = await this.request({
      path: '/payments',
      method: 'POST',
      idempotenceKey: orderId,
      body: {
        amount,
        capture: true,
        confirmation: { type: 'redirect', return_url: returnUrl.toString() },
        description,
        metadata: { orderId, productKey },
        receipt
      }
    });

    return parseYookassaPayment(payload);
  }

  async getPayment(paymentId: string): Promise<YookassaPayment> {
    const payload = await this.request({
      path: `/payments/${encodeURIComponent(paymentId)}`,
      method: 'GET'
    });

    return parseYookassaPayment(payload);
  }

  async getRefund(refundId: string): Promise<YookassaRefund> {
    const payload = await this.request({
      path: `/refunds/${encodeURIComponent(refundId)}`,
      method: 'GET'
    });

    return parseYookassaRefund(payload);
  }
}
