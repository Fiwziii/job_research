import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
    // Add any APIs you want to expose here
});
