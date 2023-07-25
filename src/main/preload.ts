// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ActionTypes } from 'renderer/config/constants';
import { SnippetState } from 'renderer/store/snippetStore';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  snippet: {
    addSnippet: (snippet) => ipcRenderer.invoke(ActionTypes.ADD, snippet),
    updateSnippet: (snippet) => ipcRenderer.invoke(ActionTypes.UPDATE, snippet),
    deleteSnippet: (snippetId) =>
      ipcRenderer.invoke(ActionTypes.DELETE, snippetId),
    getAllSnippets: (searchQuery, page, pageSize, sortByField, sortOrder) =>
      ipcRenderer.invoke(
        ActionTypes.GET_ALL,
        searchQuery,
        page,
        pageSize,
        sortByField,
        sortOrder
      ),
  } as Omit<SnippetState, 'snippets'>,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
