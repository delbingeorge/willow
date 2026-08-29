-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
