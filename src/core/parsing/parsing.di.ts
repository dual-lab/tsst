import { InjectionToken, FactoryProvider, Optional } from "injection-js";
import { ParsingHost, parsingHostFactory } from "./parsing-host";
import { DIAGNOSTIC_FORMAT_TOKEN } from "../diagnostic/diagnostic.di";
import { Step } from "../../tsst";
import { parsingStepFactory } from "./parsing-step";
import { TSCONFIG_TOKEN, TSCONFIG_EXTRA_OPTIONS_TOKEN } from "../../toolchain/tsconfig.di";

export const PARSING_HOST_TOKEN = new InjectionToken<ParsingHost>("tss.parsing.host");

export const PARSING_HOST_PROVIDER: FactoryProvider = {
    provide: PARSING_HOST_TOKEN,
    useFactory: parsingHostFactory,
    deps: [DIAGNOSTIC_FORMAT_TOKEN]
};

export const PARSING_STEP_TOKEN = new InjectionToken<Step>("tsst.step.parsing");

export const PARSING_STEP_PROVIDER: FactoryProvider = {
    provide: PARSING_STEP_TOKEN,
    useFactory: parsingStepFactory,
    deps: [PARSING_HOST_TOKEN, [new Optional(), TSCONFIG_TOKEN], [new Optional(), TSCONFIG_EXTRA_OPTIONS_TOKEN]]
};
