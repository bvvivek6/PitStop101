import type { Model } from "mongoose";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const parsePagination = (
  page?: string,
  limit?: string,
): PaginationParams => {
  const parsedPage = Math.max(Number.parseInt(page ?? "1", 10) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number.parseInt(limit ?? "20", 10) || 20, 1),
    100,
  );
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

export const paginate = async <T>(
  model: Model<T>,
  filter: Record<string, unknown>,
  params: PaginationParams,
) => {
  const [data, total] = await Promise.all([
    model
      .find(filter as never)
      .sort({ name: 1 })
      .skip(params.skip)
      .limit(params.limit)
      .lean()
      .exec(),
    model.countDocuments(filter as never).exec(),
  ]);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
};
