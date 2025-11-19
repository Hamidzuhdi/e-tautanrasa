// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Fix BigInt serialization tanpa bikin TypeScript marah
const bigIntPrototype = BigInt.prototype as unknown as { toJSON?: () => string };
if (!bigIntPrototype.toJSON) {
  bigIntPrototype.toJSON = function () {
    return this.toString();
  };
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };