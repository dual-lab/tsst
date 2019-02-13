import { TranspilerStep } from "./transpiler-step";

export class TranspilerFlow {
    private stpes: Array<TranspilerStep<any>>;
    private count: number = 0;

    add<T>(step: TranspilerStep<T>): void {
        this.count++;
        this.stpes.push(step);
    }

    getcurrent<T>(): TranspilerStep<T> {
        return this.count < 0 ? null : this.stpes[this.count - 1];
    }

}
