/** Fields carried by every domain event envelope. */
export interface DomainEventBase {
  /** ISO-8601 timestamp of when the event occurred. */
  occurredAt: string;
}
