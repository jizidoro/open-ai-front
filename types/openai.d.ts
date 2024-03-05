export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: ContentItem[];
};

export type ContentItem = {
  type: string;
  text: string;
};

export type Text = {
  value: string;
  annotations: string[];
};

export type Thread = {
  id: string;
  object: string;
  createdAt: number;
  metadata: Record<string, string>;
};

