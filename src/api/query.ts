import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface QueryResponse {
  generatedSql: string;
  queryResult: Record<string, unknown>[] | null;
  status: string;
}

export async function runQuery(naturalLanguageQuery: string): Promise<QueryResponse> {
  const response = await axios.post<QueryResponse>(
    `${BASE_URL}/api/v1/sql/generate-and-execute`,
    { naturalLanguageQuery },
  );
  return response.data;
}
