-- CreateEnum
CREATE TYPE "RoleRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "requestedRole" "Role",
ADD COLUMN     "roleRequestStatus" "RoleRequestStatus";
