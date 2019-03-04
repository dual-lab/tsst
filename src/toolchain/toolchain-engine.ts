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
import { ok } from "assert";
import {
    defaultRequireTsProvider, defaultFileNameResolver,
    JIT_STEP_TOKEN, PackageResolver, packageStoreProvider
} from "../jit/jit.di";

// tslint:disable-next-line: no-var-requires
const Module = require("module");

// tslint:disable-next-line: no-namespace
declare namespace NodeJS {
    interface Global {
        __TSST_INSTALLED__?: boolean;
    }
}

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

    install(pkgResolver: PackageResolver = { mock: () => false, resolver: null }): 0 | 1 {
        ok(!(global as NodeJS.Global).__TSST_INSTALLED__, "TSST JIT Compiler already installed.");
        const oldTsRequire = require.extensions[".ts"];
        const oldFileNameResolver = Module._resolveFilename;

        this.providers.push(defaultRequireTsProvider(oldTsRequire));
        this.providers.push(defaultFileNameResolver(oldFileNameResolver));
        this.providers.push(packageStoreProvider(pkgResolver));

        let result = 1;

        const injector = this.createInjectorContext();
        of(TranspilerFlow.init())
            .pipe(
                injector.get(VERSION_STEP_TOKEN)
                , injector.get(PARSING_STEP_TOKEN)
                , injector.get(JIT_STEP_TOKEN)
            ).subscribe((flow: TranspilerFlow) => {
                result = flow.getcurrent<number>().context;
                (global as NodeJS.Global).__TSST_INSTALLED__ = result === 0;
            }
                , (err) => {
                    // tslint:disable-next-line: no-console
                    console.error(err.message);
                    require.extensions[".ts"] = oldTsRequire;
                    Module._resolveFilename = oldFileNameResolver;
                    delete (global as NodeJS.Global).__TSST_INSTALLED__;
                });

        return result as 0 | 1;
    }

    private createInjectorContext(): Injector {
        return ReflectiveInjector.resolveAndCreate(this.providers);
    }
}
