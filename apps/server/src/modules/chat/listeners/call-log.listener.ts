import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { CallEndedEvent } from '../../../common/events/domain-events';

import { DomainEvent } from '../../../common/events/domain-events';
import { ChatCallLogService } from '../services';

@Injectable()
export class CallLogListener {
  private readonly logger = new Logger(CallLogListener.name);

  constructor(private readonly callLog: ChatCallLogService) {}

  @OnEvent(DomainEvent.CallEnded)
  async onCallEnded(event: CallEndedEvent) {
    try {
      await this.callLog.recordCall(event);
    } catch (error) {
      this.logger.warn(`Call log for ${event.callId} failed: ${String(error)}`);
    }
  }
}
