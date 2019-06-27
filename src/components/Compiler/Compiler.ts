import * as fs from "fs";
import * as path from "path";
import { DirHelper } from "../../helpers/DirHelper";
import { TypeHelper } from "../../helpers/TypeHelper";
import { CompilerOutput } from "../../interfaces/CompilerOutput";
import { ExportModel } from "../../models/ExportModel";
import { IntefaceConverter } from "../Converters/IntefaceConverter";
import { BaseCompiler } from "./base/BaseCompiler";

export class Compiler extends BaseCompiler {
  public exports: ExportModel[];

  public constructor(
    outputDir: string,
    public logicalTypes?: { [key: string]: string },
  ) {
    super();

    this.classPath = path.resolve(outputDir);
  }

  public async compileFolder(schemaPath: string): Promise<void> {
    try {
      fs.readdir(schemaPath, async (err, files) => {
        for (const file of files) {
          const fullPath = schemaPath + path.sep + file;

          if (fs.statSync(fullPath).isDirectory()) {
            await this.compileFolder(fullPath);
            continue;
          }

          const data = fs.readFileSync(fullPath).toString();
          await this.compile(data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async compile(data: any): Promise<CompilerOutput> {
    const interfaceConverter = new IntefaceConverter(this.logicalTypes);
    data = interfaceConverter.getData(data);

    const outputDir = `${this.classPath}${path.sep}`;

    if (TypeHelper.isRecordType(data)) {
      interfaceConverter.convert(data);
    }

    const result = interfaceConverter.joinExports();

    DirHelper.mkdirIfNotExist(outputDir);
    this.saveEnums(interfaceConverter.enumExports, outputDir);
    this.saveInterface(outputDir, data, result);

    return {
      class: data.name,
      dir: outputDir,
    };
  }

  protected saveInterface(outputDir: string, data: any, result: string) {
    const intefaceFile = `${outputDir}${path.sep}I${data.name}.ts`;
    fs.writeFileSync(intefaceFile, result);
    console.log(`Wrote I${data.name}.ts in ${outputDir}`);
  }

  protected saveEnums(enums: ExportModel[], outputDir: string) {
    for (const enumFile of enums) {
      const savePath = `${outputDir}${path.sep}${enumFile.name}Enum.ts`;
      fs.writeFileSync(savePath, enumFile.content);
      console.log(`Wrote ${enumFile.name}Enum.ts in ${outputDir}`);
    }
  }
}
