import { create } from 'zustand';
import { ISnippet } from 'renderer/config/types';

const { addSnippet, updateSnippet, deleteSnippet, getAllSnippets } =
  window.electron.snippet;

export interface SnippetState {
  snippets: ISnippet[];
  total: number;
  addSnippet: (snippet: ISnippet) => Promise<void>;
  updateSnippet: (snippet: ISnippet) => Promise<void>;
  deleteSnippet: (snippetId: string) => Promise<void>;
  getAllSnippets: (
    searchQuery: string,
    page: number,
    pageSize: number,
    sortBy: keyof ISnippet,
    sortOrder: string
  ) => Promise<void>;
}

export const useSnippetStore = create<SnippetState>((set) => ({
  snippets: [],
  total: 0,
  addSnippet: async (snippet) => {
    try {
      await addSnippet(snippet);
      set((state) => ({ snippets: [...state.snippets, snippet] }));
    } catch (error) {
      console.error('Error adding snippet:', error);
    }
  },

  updateSnippet: async (snippet) => {
    try {
      await updateSnippet(snippet);
      set((state) => ({
        snippets: state.snippets.map((s) =>
          s.id === snippet.id ? snippet : s
        ),
      }));
    } catch (error) {
      console.error('Error updating snippet:', error);
    }
  },

  deleteSnippet: async (snippetId) => {
    try {
      await deleteSnippet(snippetId);
      set((state) => ({
        snippets: state.snippets.filter((s) => s.id !== snippetId),
      }));
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  },

  getAllSnippets: async (searchQuery, page, pageSize, sortBy, sortOrder) => {
    try {
      const { snippets, total } = (await getAllSnippets(
        searchQuery,
        page,
        pageSize,
        sortBy,
        sortOrder
      )) as unknown as Partial<SnippetState>;

      set({ snippets, total });
    } catch (error) {
      console.error('Error fetching snippets:', error);
    }
  },
}));
