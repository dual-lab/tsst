import { Provider } from "injection-js";
import { Observable, MonoTypeOperatorFunction } from "rxjs";
import { CompilerOptions } from "typescript";
import { VERSION_PROVIDER } from "./version.di";
import { ToolchainEngine } from "./toolchain/toolchain-engine";
import { Transform } from "stream";
import { TranspilerFlow } from "./core/transpiler-flow";

export interface Tsst {
    withProviders(providers: Provider[]): Tsst;
    withTsconfig(tsconf: string): Tsst;
    withCompilerOptions(options: CompilerOptions): Tsst;
    withVersion(semver: string): Tsst;
    buildAot(): Observable<0 | 1>;
    install(): 0 | 1;
    unistall(): 0 | 1;
}

export type Step = MonoTypeOperatorFunction<TranspilerFlow>;

// tslint:disable-next-line:class-name
export function toolchain(): Tsst {
    const DEFAULT_PROVIDERS: Provider[] = [
        VERSION_PROVIDER
    ];
    return new ToolchainEngine(DEFAULT_PROVIDERS);
}
