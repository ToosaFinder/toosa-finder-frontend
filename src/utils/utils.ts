export function getURL(): string {
  return process.env.REACT_APP_API_HOST == null
    ? "localhost:8081"
    : process.env.REACT_APP_API_HOST;
}
