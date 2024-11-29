export type CreateEventInput = {
  title: string;
  description: string;
  image?: string;
  date: Date;
};

export type UpdateEventInput = Partial<CreateEventInput>;
