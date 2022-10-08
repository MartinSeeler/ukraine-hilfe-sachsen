export type ActiveValFilters = Record<string, string[]>;
export type UrlParsedValues = Record<string, string | string[] | undefined>;
export type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  page_languages: string[];
  document: boolean;
  region: string[];
  tags: string[];
  official: boolean;
};
