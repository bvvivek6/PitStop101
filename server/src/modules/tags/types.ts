export interface TagListQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
}
