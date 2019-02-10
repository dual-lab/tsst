import { Tsst } from "../tsst";
import { CompilerOptions } from "typescript";
import { Provider } from "injection-js";
import { Observable } from "rxjs";

export class ToolchainEngine implements Tsst {

    withTsconfig(tsconf: string): Tsst {
        throw new Error("Method not implemented.");
    }

    withCompilerOptions(options: CompilerOptions): Tsst {
        throw new Error("Method not implemented.");
    }

    withProviders(provider: Provider): Tsst {
        throw new Error("Method not implemented.");
    }

    buildAot(): Observable<0 | 1> {
        return Observable.throw("Method not implemented");
    }

    install(): 0 | 1 {
        throw new Error("Method not implemented.");
    }

    unistall(): 0 | 1 {
        throw new Error("Method not implemented.");
    }
}
