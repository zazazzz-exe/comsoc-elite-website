import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function audit(actorId: string, action: string, entityType: string, entityId?: string, details: Record<string, unknown> = {}) {
  await prisma.cmsAuditLog.create({ data: { actorId, action, entityType, entityId, details: details as Prisma.InputJsonValue } });
}
