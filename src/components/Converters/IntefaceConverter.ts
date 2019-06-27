import { SpecialCharacterHelper } from "../../helpers/SpecialCharacterHelper";
import { TypeHelper } from "../../helpers/TypeHelper";
import { RecordType } from "../../interfaces/AvroSchema";
import { ExportModel } from "../../models/ExportModel";
import { RecordConverter } from "./RecordConverter";

export class IntefaceConverter extends RecordConverter {
  protected interfaceRows: string[] = [];
  protected TAB = SpecialCharacterHelper.TAB;

  protected classRows: string[] = [];
  protected importRows: string[] = [];

  public convert(data: any): any {
    data = this.getData(data) as RecordType;

    this.interfaceRows.push(...this.extractInterface(data));
    this.importRows.push(...this.extractImports(data));

    this.getExportModels(data);

    return;
  }

  protected getExportModels(data: RecordType) {
    const importExportModel: ExportModel = new ExportModel();
    const interfaceExportModel: ExportModel = new ExportModel();

    importExportModel.name = "imports";
    importExportModel.content = this.importRows.join(
      SpecialCharacterHelper.NEW_LINE,
    );

    interfaceExportModel.name = this.getInterfaceName(data.name);

    interfaceExportModel.content = this.interfaceRows.join(
      SpecialCharacterHelper.NEW_LINE,
    );

    this.exports = [importExportModel, interfaceExportModel];
  }

  protected extractImports(data: RecordType): string[] {
    const rows: string[] = [];
    const dirsUp: number = data.namespace.split(".").length;

    rows.push(`// tslint:disable`);

    for (const enumFile of this.enumExports) {
      const importLine = `import { ${enumFile.name} } from "./${
        enumFile.name
      }Enum";`;
      rows.push(importLine);
    }

    for (const interfaceExport of this.interfaceExports) {
      rows.push(
        `import { ${this.getInterfaceName(
          interfaceExport,
        )} } from "./I${interfaceExport}";`,
      );
    }

    return rows;
  }

  protected extractInterface(data: RecordType): string[] {
    const interfaceRows: string[] = [];
    const TAB = SpecialCharacterHelper.TAB;

    interfaceRows.push(
      `export interface ${this.getInterfaceName(data.name)} {`,
    );

    for (const field of data.fields) {
      let fieldType;
      if (TypeHelper.hasDefault(field) || TypeHelper.isOptional(field.type)) {
        const defaultValue = TypeHelper.hasDefault(field)
          ? ` = ${TypeHelper.getDefault(field)}`
          : "";
        fieldType = `${this.getField(field)}`;
      } else {
        const convertedType = this.convertType(field.type);
        fieldType = `${field.name}: ${convertedType}`;
      }
      interfaceRows.push(`${this.TAB}${fieldType};`);
    }
    interfaceRows.push("}");
    return interfaceRows;
  }
}
