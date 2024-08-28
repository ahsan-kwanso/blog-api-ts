import { URL, URLSearchParams } from "url";

const validatePagination = (page, limit) => {
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  if (pageNumber <= 0 || pageSize <= 0) {
    return { error: "Page and limit must be positive integers" };
  }

  // Check if page and limit are numbers
  if (isNaN(pageNumber) || isNaN(pageSize)) {
    return { error: "Page and limit must be numbers" };
  }

  return { pageNumber, pageSize };
};

const generateNextPageUrl = (nextPage, pageSize, req) => {
  if (!nextPage) return null;
  const baseUrl = `${req.protocol}://${req.get("host")}${
    req.originalUrl.split("?")[0]
  }`;
  // Append pagination parameters to the existing query string
  const queryParams = new URLSearchParams(req.query);
  queryParams.set("page", nextPage);
  queryParams.set("limit", pageSize);

  return `${baseUrl}?${queryParams.toString()}`;
};

export { validatePagination, generateNextPageUrl };
