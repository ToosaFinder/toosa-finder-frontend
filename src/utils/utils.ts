export function getURL(): string {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "production") {
    return "34.67.129.19:8081";
  } else {
    return "localhost:8081";
  }
}
