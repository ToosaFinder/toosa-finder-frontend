export function getURL(): string {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "production") {
    return "34.68.138.148";
  } else {
    return "localhost:8081";
  }
}
