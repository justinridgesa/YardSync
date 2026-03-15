-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "yardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "Yard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Yard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Horse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "breed" TEXT,
    "passportNumber" TEXT,
    "assignedGroom" TEXT,
    "ownerId" TEXT,
    "feedPlan" TEXT,
    "supplements" TEXT,
    "activeMedication" TEXT,
    "workSchedule" TEXT,
    "currentAlertLevel" TEXT NOT NULL DEFAULT 'GREEN',
    "lastNoteAt" DATETIME,
    "medicationOverdue" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Horse_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "Yard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Horse_assignedGroom_fkey" FOREIGN KEY ("assignedGroom") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Horse_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "horseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nextDueDate" DATETIME NOT NULL,
    "lastDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vaccination_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "horseId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "condition" TEXT NOT NULL,
    "treatment" TEXT,
    "vetNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalHistory_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "horseId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedBy" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "Yard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "horseId" TEXT,
    "completedBy" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskCompletion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskCompletion_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TaskCompletion_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yardId" TEXT NOT NULL,
    "horseId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Note_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "Yard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Note_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yardId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "vendor" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "horseId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expense_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "Yard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "horseId" TEXT,
    "noteId" TEXT,
    "expenseId" TEXT,
    "medicalHistoryId" TEXT,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attachment_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_yardId_idx" ON "User"("yardId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Horse_passportNumber_key" ON "Horse"("passportNumber");

-- CreateIndex
CREATE INDEX "Horse_yardId_idx" ON "Horse"("yardId");

-- CreateIndex
CREATE INDEX "Horse_assignedGroom_idx" ON "Horse"("assignedGroom");

-- CreateIndex
CREATE INDEX "Horse_ownerId_idx" ON "Horse"("ownerId");

-- CreateIndex
CREATE INDEX "Vaccination_horseId_idx" ON "Vaccination"("horseId");

-- CreateIndex
CREATE INDEX "MedicalHistory_horseId_idx" ON "MedicalHistory"("horseId");

-- CreateIndex
CREATE INDEX "Task_horseId_idx" ON "Task"("horseId");

-- CreateIndex
CREATE INDEX "Task_yardId_idx" ON "Task"("yardId");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "TaskCompletion_taskId_idx" ON "TaskCompletion"("taskId");

-- CreateIndex
CREATE INDEX "TaskCompletion_horseId_idx" ON "TaskCompletion"("horseId");

-- CreateIndex
CREATE INDEX "TaskCompletion_completedBy_idx" ON "TaskCompletion"("completedBy");

-- CreateIndex
CREATE INDEX "Note_horseId_idx" ON "Note"("horseId");

-- CreateIndex
CREATE INDEX "Note_yardId_idx" ON "Note"("yardId");

-- CreateIndex
CREATE INDEX "Note_createdAt_idx" ON "Note"("createdAt");

-- CreateIndex
CREATE INDEX "Note_tag_idx" ON "Note"("tag");

-- CreateIndex
CREATE INDEX "Expense_yardId_idx" ON "Expense"("yardId");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "Expense_horseId_idx" ON "Expense"("horseId");

-- CreateIndex
CREATE INDEX "Attachment_horseId_idx" ON "Attachment"("horseId");

-- CreateIndex
CREATE INDEX "Attachment_noteId_idx" ON "Attachment"("noteId");

-- CreateIndex
CREATE INDEX "Attachment_expenseId_idx" ON "Attachment"("expenseId");
