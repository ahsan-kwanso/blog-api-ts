import { Request } from "express-validator/lib/base";
import { URL, URLSearchParams } from "url";
import paginationConfig from "./pagination.config.ts";

interface PaginationResult {
  pageNumber?: number;
  pageSize?: number;
  error?: string;
}

//these should be int
const validatePagination = (page: number, limit: number): PaginationResult => {
  const pageNumber = page || paginationConfig.defaultPage;
  const pageSize = limit || paginationConfig.defaultLimit;

  //handle pagination in validators
  if (pageNumber <= 0 || pageSize <= 0) {
    return { error: "Page and limit must be positive integers" };
  }

  return { pageNumber, pageSize };
};

// Function to generate the URL for the next page, don't use null
const generateNextPageUrl = (nextPage: number | null, pageSize: number, req: Request): string | null => {
  if (nextPage === null || nextPage === undefined) return null;
  
  const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;
  
  // Append pagination parameters to the existing query string
  const queryParams = new URLSearchParams(req.query);
  queryParams.set("page", String(nextPage));
  queryParams.set("limit", pageSize.toString());

  return `${baseUrl}?${queryParams.toString()}`;
};

export { validatePagination, generateNextPageUrl };
