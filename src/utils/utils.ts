export function getURL(): string {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "production") {
    return "34.66.25.137";
  } else {
    return "localhost:8081";
  }
}
