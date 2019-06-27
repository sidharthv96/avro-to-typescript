# avro-to-typescript

avro-to-typescript compiles avro schema files (.avsc) to TypeScript interfaces. Making using avro schematics with node.js easy and comfortable.

## Features

- Compiles most if not all avro types (**record**, **enum**, **primitive**, **map**, **array**)
- Provides methods for effective serialization and deserialization of avro to js and vice versa

## Usage

#### Global:

Most projects will use avro-to-typescript this way

```sh
npm install -g @sidv/avro-to-typescript

avro-to-typescript --compile [ schema-directory ] [ output-directory ]
```

This will generate namespaced folders and files for your schemas inside
output directory so have that in mind.

You also need to install avro-to-typescript in your project.

```
npm install @sidv/avro-to-typescript --save
```

#### Project:

This way is if your projects needs to generate avro classes while running.

```
npm install @sidv/avro-to-typescript --save
```

    import { Compiler } from "@sidv/avro-to-typescript";

    const compiler = new Compiler(outputDir);
    await compiler.compile(avro);

#### Logical Types:

If you want to take advantage of logical types, you can pass these as an argument to the cli

```sh
avro-to-typescript --compile [ schema-directory ] [ output-directory ] --logical-types [avro type] [typescript type]
```

You can even pass more than one if you alternate them:

```sh
avro-to-typescript --compile [ schema-directory ] [ output-directory ] --logical-types [avro type] [typescript type] [avro type] [typescript type]
```

You can also pass them to the compilre in your code directly:

    import { Compiler } from "@sidv/avro-to-typescript";

    const compiler = new Compiler(outputDir, { date: 'string', 'timestamp-millis': 'string'} });
    await compiler.compile(avro);

If there are logical types in the avro schema but you don't provide a mapping for them, they will default to the underlying primitive type.

## Contribution and Support

If you are having issues, please let us know on our issue tracker.

- Issue Tracker: github.com/sidharthv96/avro-to-typescript/issues
- Source Code: github.com/sidharthv96/avro-to-typescript

## License

The project is licensed under the MIT license.
