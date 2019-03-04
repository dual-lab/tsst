import { Step } from "../tsst";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { TranspilerFlow } from "../core/transpiler-flow";
import { ParsedCommandLine, createProgram, getPreEmitDiagnostics, formatDiagnostics } from "typescript";
import { ModuleResolver, compilerHostAotFactory } from "./compiler-host";
import { DiagnosticHost } from "../core/diagnostic/diagnostic-host";
import { TranspilerStep } from "../core/transpiler-step";

export function aotStepFactory(formatHost: DiagnosticHost, resolveModule: ModuleResolver): Step {
    return pipe(
        map((flow: TranspilerFlow) => {
            const outputFromParsingStep = flow.getcurrent<ParsedCommandLine>().context;
            const program = createProgram(outputFromParsingStep.fileNames,
                outputFromParsingStep.options, compilerHostAotFactory(outputFromParsingStep.options, resolveModule));
            const emitResult = program.emit();
            const allDiagnostics = getPreEmitDiagnostics(program)
                .concat(emitResult.diagnostics);
            if (emitResult.emitSkipped) { throw new Error(formatDiagnostics(allDiagnostics, formatHost)); }
            flow.add<number>(new TranspilerStep(0));
            return flow;
        })
    );
}
