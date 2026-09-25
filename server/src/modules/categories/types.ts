export interface CategoryListQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentCategory?: string;
}
