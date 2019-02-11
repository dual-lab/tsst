import { InjectionToken, FactoryProvider, ValueProvider } from "injection-js";
import { Version } from "./version";

// tslint:disable-next-line:no-var-requires
const { version } = require("../package.json");

export const VERSION_TOKEN = new InjectionToken<Version>("tsst.version");

export const VERSION_PROVIDER: ValueProvider = {
    provide: VERSION_TOKEN,
    useValue: new Version(version)
};
