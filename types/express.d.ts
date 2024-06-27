// express.d.ts
import { User } from '@prisma/client'; // Adjust the import based on where your User type is defined

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
