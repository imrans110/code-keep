import Store from 'electron-store';
import { ISnippet } from 'renderer/config/types';
import sortBy from 'lodash/sortBy';
import { SnippetState } from 'renderer/store/snippetStore';

const store = new Store();

const SNIPPETS = 'snippets';

export async function handleGetAllSnippets(
  searchQuery: string,
  page: number,
  pageSize: number,
  sortByField: keyof ISnippet = 'createdAt',
  sortOrder: string = 'desc'
): Promise<Pick<SnippetState, 'snippets' | 'total'>> {
  try {
    let snippets = store.get(SNIPPETS) as ISnippet[];

    // Search Logic
    if (searchQuery) {
      snippets = snippets.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          snippet.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting Logic
    if (sortByField && sortOrder) {
      snippets = sortBy(snippets, (snippet) => snippet[sortByField]);
      if (sortOrder === 'desc') {
        snippets = snippets.reverse();
      }
    }

    // Pagination Logic
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const snippetsToShow = snippets.slice(startIndex, endIndex);

    return {
      snippets: snippetsToShow,
      total: snippets.length,
    };
  } catch (error) {
    // Handle errors here
    console.error('Error occurred while getting all snippets:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

export async function handleAddSnippet(snippet: ISnippet): Promise<ISnippet> {
  try {
    const snippets = (store.get(SNIPPETS) as ISnippet[]) || [];
    snippets.push(snippet);
    await store.set(SNIPPETS, snippets);
    return snippet;
  } catch (error) {
    // Handle errors here
    console.error('Error occurred while adding a snippet:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

export async function handleUpdateSnippet(
  snippet: ISnippet
): Promise<ISnippet | null> {
  try {
    const snippets = store.get(SNIPPETS) as ISnippet[];
    const index = snippets.findIndex((s) => s.id === snippet.id);
    if (index !== -1) {
      snippets[index] = snippet;
      await store.set(SNIPPETS, snippets);
      return snippet;
    }
    return null;
  } catch (error) {
    // Handle errors here
    console.error('Error occurred while updating a snippet:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

export async function handleDeleteSnippet(snippetId: string): Promise<void> {
  try {
    const snippets = store.get(SNIPPETS) as ISnippet[];
    const updatedSnippets = snippets.filter((s) => s.id !== snippetId);
    await store.set(SNIPPETS, updatedSnippets);
  } catch (error) {
    // Handle errors here
    console.error('Error occurred while deleting a snippet:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
