-- CreateTable
CREATE TABLE "_EventRegistrations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventRegistrations_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventRegistrations_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventRegistrations_AB_unique" ON "_EventRegistrations"("A", "B");

-- CreateIndex
CREATE INDEX "_EventRegistrations_B_index" ON "_EventRegistrations"("B");
