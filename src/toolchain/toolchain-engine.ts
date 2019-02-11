import { Tsst } from "../tsst";
import { CompilerOptions } from "typescript";
import { Provider } from "injection-js";
import { Observable } from "rxjs";
import { tsConfigProvider, tsConfigExtraOptionsProvider } from "./tsconfig.di";

export class ToolchainEngine implements Tsst {

    private providers: Provider[];
    private lowVersionBound: string;

    constructor(initialProviders: Provider[]) {
        this.providers = [...initialProviders];
    }

    withTsconfig(tsconf: string): Tsst {
        this.providers.push(tsConfigProvider(tsconf));
        return this;
    }

    withCompilerOptions(options: CompilerOptions): Tsst {
        this.providers.push(tsConfigExtraOptionsProvider(options));
        return this;
    }

    withVersion(semver: string): Tsst {
        this.lowVersionBound = semver;
        return this;
    }

    withProviders(provider: Provider[]): Tsst {
        this.providers.push(...provider);
        return this;
    }

    buildAot(): Observable<0 | 1> {
        return Observable.throw("Method not implemented");
    }

    install(): 0 | 1 {
        throw new Error("Method not implemented.");
    }

    unistall(): 0 | 1 {
        throw new Error("Method not implemented.");
    }
}
