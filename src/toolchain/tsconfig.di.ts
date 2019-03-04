import { InjectionToken, ValueProvider } from "injection-js";
import { CompilerOptions } from "typescript";

export const TSCONFIG_TOKEN = new InjectionToken<string>("tsst.tsconfig");

// tslint:disable-next-line:class-name
export function tsConfigProvider(tsPath: string): ValueProvider {
    return {
        provide: TSCONFIG_TOKEN,
        useValue: tsPath
    };
}

export const TSCONFIG_EXTRA_OPTIONS_TOKEN = new InjectionToken<CompilerOptions>("tsst.tsconfig.extra.options");

// tslint:disable-next-line:class-name
export function tsConfigExtraOptionsProvider(extraOptions: CompilerOptions = {}): ValueProvider {
    return {
        provide: TSCONFIG_EXTRA_OPTIONS_TOKEN,
        useValue: extraOptions
    };
}
