import { Step } from "../../tsst";
import { pipe } from "rxjs";
import { ParsingHost } from "./parsing-host";
import { CompilerOptions } from "typescript";

export function parsingStepFactory(parsingHost: ParsingHost, tsConfig: string, extraOpts: CompilerOptions): Step {
    return pipe();
}
