import { CompilerHost, ResolvedModule, createCompilerHost, CompilerOptions } from "typescript";

export type ModuleResolver = (moduleNames: string[], containingFile: string) => [ResolvedModule | undefined];

export function compilerHostAotFactory(
    opts: CompilerOptions,
    customModuleResolver: ModuleResolver)
    : CompilerHost {
    const defaultHost = createCompilerHost(opts);
    return customModuleResolver ? { ...defaultHost, resolveModuleNames: customModuleResolver } : defaultHost;
}
