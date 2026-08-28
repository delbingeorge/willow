-- CreateTable
CREATE TABLE "document_yjs_states" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "state" BYTEA NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_yjs_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_yjs_states_document_id_key" ON "document_yjs_states"("document_id");

-- AddForeignKey
ALTER TABLE "document_yjs_states" ADD CONSTRAINT "document_yjs_states_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
