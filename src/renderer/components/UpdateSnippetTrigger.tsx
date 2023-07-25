import { Pencil1Icon } from '@radix-ui/react-icons'; // Assuming these are SVG icons
import { DialogClose } from '@radix-ui/react-dialog';

import { ISnippet } from 'renderer/config/types';
import { SnippetForm } from './SnippetForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export const UpdateSnippetTrigger = ({ snippet }: { snippet: ISnippet }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Snippet</DialogTitle>
          <SnippetForm actionType="edit" snippet={snippet} />
        </DialogHeader>
      </DialogContent>
      <DialogClose />
    </Dialog>
  );
};
