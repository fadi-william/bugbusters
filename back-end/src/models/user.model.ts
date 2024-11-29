import { User } from "@prisma/client";

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export { User };
