const defaultOptions = { method: "GET", headers: { "Content-Type": "application/json" } };

export const fetcher = async (url, options = defaultOptions) => {
  return await fetch(url, options).then(response => response.json());
};
