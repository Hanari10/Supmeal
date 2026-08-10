import { api } from './api';

export interface ImportResult {
  message: string;
  importedRecipes: number;
  importedCookbooks: number;
}

export async function exportData(): Promise<Blob> {
  const response = await api.get('/data-transfer/export', {
    responseType: 'blob',
  });

  return response.data;
}

export async function importData(
  file: File,
): Promise<ImportResult> {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post<ImportResult>(
    '/data-transfer/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}