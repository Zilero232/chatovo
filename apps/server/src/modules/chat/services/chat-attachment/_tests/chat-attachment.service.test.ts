import { beforeEach, describe, expect, it, vi } from 'vitest';

const assertCanAccessRoom = vi.fn();
const processChatImage = vi.fn();
const saveUpload = vi.fn();

vi.mock('../../../../../lib', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  assertCanAccessRoom: (input: unknown) => assertCanAccessRoom(input),
  processChatImage: (input: unknown) => processChatImage(input)
}));

vi.mock('../../../../uploads', () => ({
  saveUpload: (...args: unknown[]) => saveUpload(...args),
  toArrayBuffer: (buffer: Buffer) => buffer
}));

const { AppForbiddenException } = await import('../../../../../common/exceptions');
const { ChatAttachmentService } = await import('../chat-attachment.service');

const ROOM_ID = '5f0c3a9e-8f1e-4e2a-9d3b-2c6f7a1b0e4d';

const FILE = {
  buffer: Buffer.from('hello'),
  size: 5,
  mimetype: 'text/plain',
  originalname: 'note.txt'
} as never;

describe('ChatAttachmentService.uploadAttachment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    processChatImage.mockResolvedValue(null);
    saveUpload.mockResolvedValue('/uploads/chat-attachments/note.txt');
  });

  it('refuses a user banned from the room before storing anything', async () => {
    assertCanAccessRoom.mockRejectedValueOnce(
      new AppForbiddenException('ROOM_BANNED', 'Banned from this room')
    );

    await expect(
      new ChatAttachmentService().uploadAttachment({ roomId: ROOM_ID, file: FILE, userId: 'u-1' })
    ).rejects.toMatchObject({ response: { code: 'ROOM_BANNED' } });
    expect(assertCanAccessRoom).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: 'u-1' });
    expect(saveUpload).not.toHaveBeenCalled();
  });
});
