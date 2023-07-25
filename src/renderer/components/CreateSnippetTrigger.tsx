import { SnippetForm } from './SnippetForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export const CreateSnippetTrigger = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Snippet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Snippet</DialogTitle>
          <SnippetForm actionType="create" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
