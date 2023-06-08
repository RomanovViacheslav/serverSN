/*
  Warnings:

  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChatMessage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ChatMessageModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessageModel_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChatMessageModel_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
