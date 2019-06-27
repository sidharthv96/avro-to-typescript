import { BaseConverter } from "./base/BaseConverter";

export class PrimitiveConverter extends BaseConverter {
  public static isPrimitive(type: string): boolean {
    return type in PrimitiveConverter.typeMap;
  }

  private static typeMap = {
    long: "number",
    int: "number",
    double: "number",
    float: "number",
    string: "string",
    bytes: "Buffer",
    null: "null",
    boolean: "boolean",
  };

  public convert(type: string): string {
    return PrimitiveConverter.typeMap[type] || "any";
  }
}
