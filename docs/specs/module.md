# Spec - Module

This is spec is about the transpiler structure and the main concepts behind the api
created by this module.

This module is based on the _typescrpt compiler API_; used for ahead of time compilation
and just in time compiltion. The second one is usefull to transpile typescript files during
node execution process like with _ts-node_.

## Core

Tasks shared between AOT and JIT api:

1. parse the `tsconfig.json` file
    - use `ts.getParsedCommandLineOfConfigFile(pathTofile, extendedCompilerOptions, host?): ParsedCommandLine`. The output contains
    options compiler object, fileNames to transpile and possible errors diasgnostic.
    - Check that the return object field _errors_ is of length zero., If there are  diagnostics errors print them formatted
    using `ts.formatDiagnostics` method.

    > This common phase need two type of host, that have to be passed to the typescript api method.
    > 1. `ParsedConfigFileHost` used for parsing _tsconfig.json_ file
    > 2. `FormatHost` used for formatting diagnostics error object.

2. create the `CompilerHost`
    - use `ts.createCompilerHost`, this method return the deafult typescript host that can be extended
    > For example could be passed a custom module resolution strategy.
    > This is done overriding the `resolveModuleNames(mouleNames: [], containingFile): Array<ResolvedModule | undefined>`.
    > To call the default module resolution we can use `ts.resolveModuleName`.

## AOT (Ahead of Time)
The aot api use typescript low level function to generate the transpiled javascript files:

1. create the _program_ instance with `ts.createProgram([sources], compilerOptions, host)`
2. emit the transpilation with `program.emit()`
3. concat all the diagnostics
    - _pre-emitted diagnostics_ + _emittedResult diagnostics_
    - output the diagnostics in a formatted message.
4. check the `emitSkipped` flag, if true return 1 else 0

## JIT (Just in Time)
The jit api transpiler the source when the node process require it:

1. transpiler the source with `ts.transpileModule`
2. check for errors diagnostic, interrupt if there are
3. compile the transpile code with node js low level api

## Transpiler Flow

## DI (Dependency Injection)

All the dependencies in this project are managed using the [injection-js](https://github.com/mgechev/injection-js)
module, that is based on Angular _ReflectiveInjector_ api.
All the principal transform function, are injected using specific providers.
