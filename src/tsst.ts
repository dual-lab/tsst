import { Provider } from "injection-js";
import { Observable } from "rxjs";
import { CompilerOptions } from "typescript";

export interface Tsst {
    withProviders(providers: Provider[]): Tsst;
    withTsconfig(tsconf: string): Tsst;
    withCompilerOptions(options: CompilerOptions): Tsst;
    withVersion(semver: string): Tsst;
    buildAot(): Observable<0 | 1>;
    install(): 0 | 1;
    unistall(): 0 | 1;
}

// tslint:disable-next-line:class-name
export function toolchain(): Tsst {
    return null;
}
