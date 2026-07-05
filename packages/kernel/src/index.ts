/**
 * Kernel — core, framework-agnostic domain primitives for Forge.
 *
 * The kernel is the shared foundation every domain builds on: identifiers,
 * time, and domain error types. Domains depend on the kernel rather than
 * reinventing these primitives.
 */

export * from "./product";
export * from "./id";
export * from "./clock";
export * from "./errors";
