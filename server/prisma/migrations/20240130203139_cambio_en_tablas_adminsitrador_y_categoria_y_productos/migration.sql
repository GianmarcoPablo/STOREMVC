-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_vendedorId_fkey";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "administradorId" INTEGER,
ADD COLUMN     "vendedorId" INTEGER;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "administradorId" INTEGER,
ALTER COLUMN "vendedorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "Administrador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "Administrador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
