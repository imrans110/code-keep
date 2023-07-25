import React, { useCallback, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TrashIcon, CopyIcon } from '@radix-ui/react-icons'; // Assuming these are SVG icons

import { ISnippet } from 'renderer/config/types';
import { useSnippetStore } from 'renderer/store/snippetStore';
import { useToast } from './ui/use-toast';
import { UpdateSnippetTrigger } from './UpdateSnippetTrigger';
import { Button } from './ui/button';

export const SnippetList = () => {
  const {
    snippets,
    getAllSnippets,
    total: totalSnippets,
    deleteSnippet,
  } = useSnippetStore((state) => ({
    snippets: state.snippets,
    getAllSnippets: state.getAllSnippets,
    total: state.total,
    deleteSnippet: state.deleteSnippet,
  }));

  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const fetchSnippets = useCallback(
    async (page: number) => {
      await getAllSnippets(searchQuery, page, pageSize, 'createdAt', 'desc');
    },
    [getAllSnippets, searchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    fetchSnippets(1);
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
    fetchSnippets(page);
  };

  useEffect(() => {
    fetchSnippets(1);
  }, [fetchSnippets]);

  const totalPages = Math.ceil(totalSnippets / pageSize);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);

      toast({
        title: 'Code copied to clipboard',
      });
    } catch (error) {
      console.error('Error copying code:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search snippets..."
          className="w-full p-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="space-y-6">
        {snippets.map((snippet: ISnippet) => (
          <div
            key={snippet.id}
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{snippet.title}</h3>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopyCode(snippet.code)}
                >
                  <CopyIcon />
                </Button>
                <p className="text-sm text-gray-500">
                  Language: {snippet.lang}
                </p>
              </div>
            </div>
            <p className="text-gray-600">{snippet.description}</p>
            <SyntaxHighlighter
              language="typescript"
              style={coldarkDark}
              wrapLines
              wrapLongLines
              customStyle={{ borderRadius: '5px' }}
            >
              {snippet.code}
            </SyntaxHighlighter>
            <p className="text-sm mt-2 text-gray-500">
              Created At: {new Date(snippet.createdAt).toLocaleString()}
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <UpdateSnippetTrigger snippet={snippet} />
              <Button onClick={() => deleteSnippet(snippet.id)}>
                <TrashIcon />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageNumber
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              }`}
              onClick={() => handlePaginationChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
  );
};
