import { Tsst } from "../tsst";
import { CompilerOptions } from "typescript";
import { Provider, Injector, ReflectiveInjector } from "injection-js";
import { Observable } from "rxjs";
import { tsConfigProvider, tsConfigExtraOptionsProvider } from "./tsconfig.di";
import { expectedVersionProvider } from "../version.di";

export class ToolchainEngine implements Tsst {

    private providers: Provider[];

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
        this.providers.push(expectedVersionProvider(semver));
        return this;
    }

    withProviders(provider: Provider[]): Tsst {
        this.providers.push(...provider);
        return this;
    }

    buildAot(): Observable<0 | 1> {
        const injector = this.createInjectorContext();
        return Observable.throw("Method not implemented");
    }

    install(): 0 | 1 {
        throw new Error("Method not implemented.");
    }

    unistall(): 0 | 1 {
        throw new Error("Method not implemented.");
    }

    private createInjectorContext(): Injector {
        return ReflectiveInjector.resolveAndCreate(this.providers);
    }
}
