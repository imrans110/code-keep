import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Button } from 'renderer/components/ui/button';
import { startCase } from 'lodash';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'renderer/components/ui/form';
import { Input } from 'renderer/components/ui/input';
import { ISnippet } from 'renderer/config/types';
import { useSnippetStore } from 'renderer/store/snippetStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';

const snippetSchema = z.object({
  id: z.string(),
  title: z.string().nonempty({ message: 'Title is required' }),
  description: z.string().nonempty({ message: 'Description is required' }),
  code: z.string().nonempty({ message: 'Code snippet is required' }),
  lang: z.string().nonempty({ message: 'Language is required' }),
  createdAt: z.string(),
});

const langOptions = SyntaxHighlighter.supportedLanguages.map((lang) => ({
  label: startCase(lang),
  value: lang,
}));

type SnippetFormProps =
  | {
      actionType: 'create';
      snippet?: ISnippet;
    }
  | {
      actionType: 'edit';
      snippet: ISnippet;
    };

export const SnippetForm = ({
  actionType = 'create',
  snippet = undefined,
}: SnippetFormProps) => {
  const { addSnippet, updateSnippet } = useSnippetStore();
  const { toast } = useToast();

  const isCreateFlow = actionType === 'create';

  const form = useForm<ISnippet>({
    resolver: zodResolver(snippetSchema),
    defaultValues: isCreateFlow
      ? {
          id: `snippet_${Date.now()}`,
          title: '',
          description: '',
          code: '',
          lang: '',
          createdAt: new Date(),
        }
      : snippet,
  });

  async function onSubmit(values: ISnippet) {
    try {
      if (isCreateFlow) {
        await addSnippet(values);
        toast({
          title: `Snippet Added : ${values.title} `,
        });
      } else {
        await updateSnippet(values);
        toast({
          title: `Snippet updated : ${values.title} `,
        });
      }
    } catch (error) {
      console.error('Error adding snippet:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the title" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors?.title?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="label"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {langOptions.map(({ label, value }) => (
                        <SelectItem key={label} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>
                    {form.formState.errors?.lang?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Enter the description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors?.description?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Snippet</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter the code snippet"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors?.code?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
