import { InjectionToken, ValueProvider, FactoryProvider } from "injection-js";
import { Version } from "./version";
import { Step } from "./tsst";
import { versionStepFactory } from "./version-step";

// tslint:disable-next-line:no-var-requires
const { version } = require("../package.json");

export const VERSION_TOKEN = new InjectionToken<Version>("tsst.version");

export const VERSION_PROVIDER: ValueProvider = {
    provide: VERSION_TOKEN,
    useValue: new Version(version)
};

export const EXPECTED_VERSION_TOKEN = new InjectionToken<string>("tsst.expected.version");

// tslint:disable-next-line:class-name
export function expectedVersionProvider(semver: string): ValueProvider {
    return {
        provide: EXPECTED_VERSION_TOKEN,
        useValue: semver
    };
}

export const VERSION_STEP_TOKEN = new InjectionToken<Step>("tsst.step.version");

export const VERSION_STEP_PROVIDER: FactoryProvider = {
    provide: VERSION_STEP_TOKEN,
    useFactory: versionStepFactory,
    deps: [VERSION_TOKEN, EXPECTED_VERSION_TOKEN]
};
