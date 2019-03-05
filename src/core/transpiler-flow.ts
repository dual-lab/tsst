import { TranspilerStep } from "./transpiler-step";

export class TranspilerFlow {
    static init(): TranspilerFlow {
        const flow = new TranspilerFlow();
        flow.add(new TranspilerStep<never>(null as never));

        return flow;
    }

    private stpes: Array<TranspilerStep<any>> = [];
    private count: number = 0;

    add<T>(step: TranspilerStep<T>): void {
        this.count++;
        this.stpes.push(step);
    }

    getcurrent<T>(): TranspilerStep<T> {
        return this.count < 0 ? null : this.stpes[this.count - 1];
    }

}
