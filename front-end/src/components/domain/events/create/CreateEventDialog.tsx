import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '../../../ui/datepicker';
import { Label } from '@/components/ui/label';
import { createEvent, ICreateEventData } from '@/services/events'; // Import the createEvent function

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  date: yup.string().required('Date is required'),
  image: yup.mixed().test('required', 'Image is required', (value) => {
    const val = value as FileList;
    return val && val.length > 0;
  }),
});

type FormData = yup.InferType<typeof schema>;

const CreateEventDialog = ({ isOpen, onClose }: CreateEventDialogProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const eventData: ICreateEventData = {
      title: data.title,
      description: data.description,
      date: data.date,
      image: (data.image as FileList)[0], // Get the first file from the FileList
    };

    try {
      await createEvent(eventData); // Call the createEvent function
      onClose(); // Close the dialog after successful creation
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const registerDate = { ...register('date'), ref: undefined };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter event title"
                {...register('title')}
                aria-invalid={errors.title ? 'true' : 'false'}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                {...register('description')}
                aria-invalid={errors.description ? 'true' : 'false'}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <DatePicker
                {...registerDate}
                onChange={(date) => {
                  setValue('date', date ? date.toISOString() : '');
                  trigger('date');
                }}
                aria-invalid={errors.date ? 'true' : 'false'}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Image</Label>
              <Input
                type="file"
                {...register('image')}
                aria-invalid={errors.image ? 'true' : 'false'}
              />
              {errors.image && (
                <p className="text-sm text-destructive">
                  {errors.image.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" onClick={onClose} variant={'ghost'}>
                Cancel
              </Button>
              <Button type="submit" variant={'default'} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
