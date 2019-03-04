import { FormatDiagnosticsHost, sys } from "typescript";

export class DiagnosticHost implements FormatDiagnosticsHost {
    getCurrentDirectory(): string {
        return sys.getCurrentDirectory();
    }

    getCanonicalFileName(fileName: string): string {
        return sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }

    getNewLine(): string {
        return sys.newLine;
    }
}

export function diagnosticHostFactory() {
    return new DiagnosticHost();
}
