import { Request } from "express-validator/lib/base";
import { URL, URLSearchParams } from "url";

interface PaginationResult {
  pageNumber?: number;
  pageSize?: number;
  error?: string;
}

const validatePagination = (page: string | undefined, limit: string | undefined): PaginationResult => {
  const pageNumber = parseInt(page || '', 10);
  const pageSize = parseInt(limit || '', 10);

  if (pageNumber <= 0 || pageSize <= 0) {
    return { error: "Page and limit must be positive integers" };
  }

  // Check if page and limit are numbers
  if (isNaN(pageNumber) || isNaN(pageSize)) {
    return { error: "Page and limit must be numbers" };
  }

  return { pageNumber, pageSize };
};

// Function to generate the URL for the next page
const generateNextPageUrl = (nextPage: number | null, pageSize: number, req: Request): string | null => {
  if (nextPage === null || nextPage === undefined) return null;
  
  const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;
  
  // Append pagination parameters to the existing query string
  const queryParams = new URLSearchParams(req.query as any);
  queryParams.set("page", String(nextPage));
  queryParams.set("limit", pageSize.toString());

  return `${baseUrl}?${queryParams.toString()}`;
};

export { validatePagination, generateNextPageUrl };
