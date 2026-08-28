import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export async function snapshotYjsContent(prisma: PrismaService, documentId: string): Promise<Prisma.InputJsonValue> {
  const yjsState = await prisma.documentYjsState.findUnique({
    where: { documentId },
  });

  return { rawYjsState: yjsState ? Buffer.from(yjsState.state).toString('base64') : null };
}
