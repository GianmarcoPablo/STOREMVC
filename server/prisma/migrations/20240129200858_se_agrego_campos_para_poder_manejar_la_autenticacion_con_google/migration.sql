-- AlterEnum
ALTER TYPE "Rol" ADD VALUE 'VENDEDOR';

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "googleId" TEXT;
