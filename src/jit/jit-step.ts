import { Step } from "../tsst";
import { pipe } from "rxjs";
import { DiagnosticHost } from "../core/diagnostic/diagnostic-host";
import { PackageResolver } from "./jit.di";
import { tap, map } from "rxjs/operators";
import { TranspilerFlow } from "../core/transpiler-flow";
import { TranspilerStep } from "../core/transpiler-step";
import { ParsedCommandLine, transpileModule, formatDiagnostics } from "typescript";
import { readFileSync, existsSync } from "fs";

export type RequireExtension = (module: NodeModule, filename: string) => any;
export type FileNameResolver = (request: string, module: any) => string;

export function jitStepFactory(
    oldTsRequireExt: RequireExtension,
    oldFileNameResolver: FileNameResolver,
    diagnosticHost: DiagnosticHost,
    resolvePkg: PackageResolver): Step {

    return pipe(
        tap((flow: TranspilerFlow) => {
            const parsedOutput = flow.getcurrent<ParsedCommandLine>().context;
            // tslint:disable-next-line: only-arrow-functions
            require.extensions[".ts"] = function(module: any, filename: string) {
                if (filename.match(/node_modules/)) {
                    if (oldTsRequireExt) { return oldTsRequireExt(module, filename); }
                    return module._compile(readFileSync(filename, "utf-8"), filename);
                }
                const source = readFileSync(filename, "utf-8");
                try {
                    const result = transpileModule(source,
                        { compilerOptions: parsedOutput.options, fileName: filename });
                    if (result.diagnostics.length > 0) {
                        throw new Error(formatDiagnostics(result.diagnostics, diagnosticHost));
                    }

                    return module._compile(result.outputText, filename);
                } catch (error) {
                    // tslint:disable-next-line: no-console
                    console.error(`Error in script ${filename}: ${error.message}`);
                    // tslint:disable-next-line: no-console
                    console.error(error.stack);
                    throw error;
                }
            };
        }),
        tap(() => {
            if (resolvePkg.mock()) {
                const Module = require("module");
                Module._resolveFilename = function(request: string, parent: any) {
                    const customResolved = resolvePkg.resolver(request);
                    if (customResolved) {
                        return customResolved;
                    } else {
                        if (Module.builtinModules.includes(request)) {
                            return oldFileNameResolver.call(this, request, parent);
                        } else {
                            let resolved = null;
                            try {
                                resolved = oldFileNameResolver.call(this, request, parent);
                            } catch (e) {
                                throw e;
                            }

                            if (resolved.match(/[\\\/]node_modules[\\\/]/)) {
                                return resolved;
                            } else if (request.endsWith(".json")) {
                                return resolved;
                            } else {
                                const maybeTs = resolved.replace(".json", ".ts");
                                if (existsSync(maybeTs)) { return maybeTs; }
                                return resolved;
                            }
                        }
                    }
                };
            }
        }),
        map((flow: TranspilerFlow) => {
            flow.add<number>(new TranspilerStep(0));
            return flow;
        })
    );
}
