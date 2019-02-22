import { ParseConfigFileHost, sys, DiagnosticReporter, formatDiagnostic } from "typescript";
import { DiagnosticHost } from "../diagnostic/diagnostic-host";

export class ParsingHost implements ParseConfigFileHost {

    useCaseSensitiveFileNames: boolean;
    onUnRecoverableConfigFileDiagnostic: DiagnosticReporter;

    constructor(private diagnostichost: DiagnosticHost) {
        this.useCaseSensitiveFileNames = sys.useCaseSensitiveFileNames;
        this.onUnRecoverableConfigFileDiagnostic = (diagnostic) => {
            formatDiagnostic(diagnostic, this.diagnostichost);
        };
    }

    getCurrentDirectory(): string {
        return sys.getCurrentDirectory();
    }

    readDirectory(
        rootDir: string,
        extensions: ReadonlyArray<string>,
        excludes: ReadonlyArray<string>, includes: ReadonlyArray<string>, depth?: number): ReadonlyArray<string> {

        return sys.readDirectory(rootDir, extensions, excludes, includes, depth);
    }

    fileExists(path: string): boolean {
        return sys.fileExists(path);
    }

    readFile(path: string): string {
        return sys.readFile(path);
    }

    trace?(s: string): void {
        // DO Nothing
    }

}

export function parsingHostFactory(diagnosticHost: DiagnosticHost) {
    return new ParsingHost(diagnosticHost);
}
