/** An ISO-8601 timestamp string. */
export type IsoTimestamp = string;

/** Current time as an ISO-8601 timestamp. */
export function now(): IsoTimestamp {
  return new Date().toISOString();
}
