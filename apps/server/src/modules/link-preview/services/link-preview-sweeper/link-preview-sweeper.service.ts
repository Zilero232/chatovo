import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { sweepUploadFolder } from '../../../../lib';
import { LINK_PREVIEW } from '../../config';

@Injectable()
export class LinkPreviewSweeperService {
  private readonly logger = new Logger(LinkPreviewSweeperService.name);

  @Cron(LINK_PREVIEW.unfurl.image.sweepCron)
  async sweep(): Promise<number> {
    const { folder, maxAgeMs } = LINK_PREVIEW.unfurl.image;
    const { removed, total } = await sweepUploadFolder({ folder, maxAgeMs });

    if (removed > 0) {
      this.logger.log(`Removed ${removed} of ${total} link preview images`);
    }

    return removed;
  }
}
