import { FactoryProvider, InjectionToken } from "injection-js";
import { DiagnosticHost, diagnosticHostFactory } from "./diagnostic-host";

export const DIAGNOSTIC_FORMAT_TOKEN = new InjectionToken<DiagnosticHost>("tsst.diagnostic.format.host");

export const DIAGNOSTIC_FORMAT_PROVIDER: FactoryProvider = {
    provide: DIAGNOSTIC_FORMAT_TOKEN,
    useFactory: diagnosticHostFactory
};
