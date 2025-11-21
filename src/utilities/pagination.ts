import { Model, Document, FilterQuery } from 'mongoose';

/**
 * Pagination utility
 * Generic function for paginating Mongoose model queries
 */

export interface PaginationResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Paginate a Mongoose model query
 * @param Model - Mongoose model to query
 * @param query - MongoDB query filter
 * @param limit - Number of items per page
 * @param offset - Number of items to skip
 * @param sort - Optional sort object (default: { createdAt: 'desc' })
 * @param populate - Optional populate options
 * @returns Promise<PaginationResult<T>> - Paginated results with metadata
 */
export async function paginate<T extends Document>(
  Model: Model<T>,
  query: FilterQuery<T> = {},
  limit: number = 20,
  offset: number = 0,
  sort: any = { createdAt: 'desc' },
  populate?: string | any
): Promise<PaginationResult<T>> {
  // Validate and sanitize pagination parameters
  const validLimit = Math.max(1, Math.min(limit, 100)); // Between 1 and 100
  const validOffset = Math.max(0, offset); // Non-negative

  // Build query
  let queryBuilder = Model.find(query);

  // Apply populate if provided
  if (populate) {
    if (typeof populate === 'string') {
      queryBuilder = queryBuilder.populate(populate);
    } else if (Array.isArray(populate)) {
      populate.forEach((pop: any) => {
        queryBuilder = queryBuilder.populate(pop);
      });
    } else {
      queryBuilder = queryBuilder.populate(populate);
    }
  }

  // Execute queries in parallel
  const [data, total] = await Promise.all([
    queryBuilder
      .sort(sort)
      .limit(validLimit)
      .skip(validOffset)
      .exec(),
    Model.countDocuments(query)
  ]);

  return {
    data,
    total,
    limit: validLimit,
    offset: validOffset,
    hasMore: validOffset + validLimit < total
  };
}

