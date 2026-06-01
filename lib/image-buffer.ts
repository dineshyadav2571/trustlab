/** Normalize MongoDB / Mongoose binary fields to a Node Buffer. */
export function toImageBuffer(value: unknown): Buffer {
  if (!value) return Buffer.alloc(0);
  if (Buffer.isBuffer(value)) return Buffer.from(value);
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (
      record._bsontype === "Binary" &&
      (record.buffer instanceof Uint8Array || record.buffer instanceof ArrayBuffer)
    ) {
      return Buffer.from(record.buffer as Uint8Array);
    }
    if (record.buffer instanceof ArrayBuffer) {
      return Buffer.from(record.buffer);
    }
    if (record.buffer instanceof Uint8Array) {
      return Buffer.from(record.buffer);
    }
    if (typeof record.value === "function") {
      try {
        const binary = value as { value: (encoding: string) => string };
        return Buffer.from(binary.value("base64"), "base64");
      } catch {
        // fall through
      }
    }
  }
  return Buffer.alloc(0);
}
