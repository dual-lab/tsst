import { Tsst } from "../tsst";
import { CompilerOptions } from "typescript";
import { Provider, Injector, ReflectiveInjector } from "injection-js";
import { Observable, of } from "rxjs";
import { tsConfigProvider, tsConfigExtraOptionsProvider } from "./tsconfig.di";
import { expectedVersionProvider, VERSION_STEP_TOKEN } from "../version.di";
import { TranspilerFlow } from "../core/transpiler-flow";
import { map, catchError } from "rxjs/operators";
import { PARSING_STEP_TOKEN } from "../core/parsing/parsing.di";
import { AOT_STEP_TOKEN } from "../aot/aot.di";

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
        return of(TranspilerFlow.init())
            .pipe(
                injector.get(VERSION_STEP_TOKEN)
                , injector.get(PARSING_STEP_TOKEN)
                , injector.get(AOT_STEP_TOKEN)
                , catchError((err) => {
                    // tslint:disable-next-line: no-console
                    console.error(err.message);
                    return of(TranspilerFlow.init());
                })
                , map<TranspilerFlow, 0 | 1>((flow) => flow.getcurrent<any>().context !== null ? 0 : 1)
            );
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
