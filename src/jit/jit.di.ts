import { InjectionToken, ValueProvider, FactoryProvider } from "injection-js";
import { RequireExtension, FileNameResolver, jitStepFactory } from "./jit-step";
import { Step } from "../tsst";
import { DIAGNOSTIC_FORMAT_TOKEN } from "../core/diagnostic/diagnostic.di";

export const DEFAULT_TS_REQUIRE_TOKEN = new InjectionToken<RequireExtension>("tsst.default.require.ts.ext");

export function defaultRequireTsProvider(old: RequireExtension): ValueProvider {
    return {
        provide: DEFAULT_TS_REQUIRE_TOKEN,
        useValue: old
    };
}

export const DEFAULT_FILE_NAME_RESOLVER = new InjectionToken<FileNameResolver>("tsst.default.file.name.resolver");

export function defaultFileNameResolver(old: FileNameResolver): ValueProvider {
    return {
        provide: DEFAULT_FILE_NAME_RESOLVER,
        useValue: old
    };
}

export interface PackageResolver { resolver: (request: string) => string; mock: () => boolean; }

export const JIT_PACKAGES_STORE_TOKEN = new InjectionToken<PackageResolver>("tsst.store.packages.jit");

export function packageStoreProvider(resolver: PackageResolver): ValueProvider {
    return {
        provide: JIT_PACKAGES_STORE_TOKEN,
        useValue: resolver
    };
}

export const JIT_STEP_TOKEN = new InjectionToken<Step>("tsst.step.jit");

export const JIT_STEP_PROVIDER: FactoryProvider = {
    provide: JIT_STEP_TOKEN,
    useFactory: jitStepFactory,
    deps: [DEFAULT_TS_REQUIRE_TOKEN, DEFAULT_FILE_NAME_RESOLVER, DIAGNOSTIC_FORMAT_TOKEN, JIT_PACKAGES_STORE_TOKEN]
};
