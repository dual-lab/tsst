import { Step } from "./tsst";
import { Version } from "./version";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { TranspilerStep } from "./core/transpiler-step";

export function versionStepFactory(current: Version, expected: string): Step {
    return pipe(
        map((flow) => {
            if (expected && !current.isEqual(expected)) {
                throw new Error(`Expected version not match current one. Expected: ${expected} Current: ${current}`);
            }
            flow.add(new TranspilerStep<Version>(current));
            return flow;
        })
    );
}
