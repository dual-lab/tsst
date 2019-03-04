import { Step } from "../../tsst";
import { pipe } from "rxjs";
import { ParsingHost } from "./parsing-host";
import { CompilerOptions, getParsedCommandLineOfConfigFile, ParsedCommandLine, formatDiagnostics } from "typescript";
import { map } from "rxjs/operators";
import { resolve } from "path";
import { DiagnosticHost } from "../diagnostic/diagnostic-host";
import { TranspilerStep } from "../transpiler-step";

export function parsingStepFactory(
    parsingHost: ParsingHost,
    formatHost: DiagnosticHost,
    tsConfig: string, extraOpts?: CompilerOptions): Step {
    return pipe(
        map(
            (flow) => {
                if (tsConfig) {
                    const parsedContext: ParsedCommandLine = getParsedCommandLineOfConfigFile(resolve(tsConfig),
                        extraOpts, parsingHost);
                    if (parsedContext.errors.length > 0) {
                        throw new Error(formatDiagnostics(parsedContext.errors, formatHost));
                    }
                    flow.add<ParsedCommandLine>(new TranspilerStep(parsedContext));
                    return flow;
                } else {
                    throw new Error("tsconfig.json is required");
                }
            }
        )
    );
}
