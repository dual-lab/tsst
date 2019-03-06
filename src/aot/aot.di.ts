import { InjectionToken, FactoryProvider, Optional } from "injection-js";
import { ModuleResolver } from "./compiler-host";
import { Step } from "../tsst";
import { aotStepFactory } from "./aot-step";
import { DIAGNOSTIC_FORMAT_TOKEN } from "../core/diagnostic/diagnostic.di";

export const CUSTOM_MODULE_RESOLVER_TOKEN = new InjectionToken<ModuleResolver>("tsst.aot.module.resolver");

export const AOT_STEP_TOKEN = new InjectionToken<Step>("tsst.step.aot");
export const AOT_STEP_PROVIDER: FactoryProvider = {
    provide: AOT_STEP_TOKEN,
    useFactory: aotStepFactory,
    deps: [DIAGNOSTIC_FORMAT_TOKEN, [new Optional(), CUSTOM_MODULE_RESOLVER_TOKEN]]
};
