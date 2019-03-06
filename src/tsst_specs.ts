import { join, basename } from "path";
import { writeFile, unlink, existsSync } from "fs";
import { toolchain } from "./tsst";
import { AssertionError } from "assert";

// tslint:disable-next-line: no-var-requires
const Module = require("module");

describe("Typescript simple transpiler", () => {
    const outDir = "./dist-tmp";
    const tsFileName = join(__dirname, "transpile-me.ts");
    const tsContent = `
export default "TRANSPILED";
`;
    const tsConfig = join(__dirname, "tsconfig.json");
    const tsConfigContent = `
{
    "compilerOptions": {
    "rootDir": ".",
    "declaration": false,
    "outDir": "${outDir}",
    "module": "commonjs",
    "target": "esnext",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "pretty": true,
    "noEmitOnError": true,
    "noImplicitAny": true,
    "sourceMap": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "lib": [
        "esnext"
    ],
    "types": [
        "node",
        "jasmine"
    ]
    },
    "files": [
       "${tsFileName}"
    ]
}
    `;
    beforeAll((done) => {
        writeFile(tsFileName, tsContent, (err) => {
            if (err) {
                done.fail(err);
            } else {
                writeFile(tsConfig, tsConfigContent, (err) => {
                    (done as any)(err || null);
                });
            }
        });
    });

    describe("AOT api transpiler", () => {
        it("Should transpile ts to js", () => {
            toolchain().withTsconfig(tsConfig).buildAot()
                .subscribe((result) => {
                    expect(result).toBe(0);
                    expect(existsSync(join(__dirname, outDir))).toBe(true);
                    expect(require(join(__dirname, outDir, basename(tsFileName).replace(".ts", ".js"))).default)
                        .toBe("TRANSPILED");
                });
        });
    });

    describe("JIT api transpiler", () => {
        let oldRequiredts: any = null;
        let oldFileNameResolver: any = null;
        beforeEach(() => {
            oldFileNameResolver = Module._resolveFilename;
            oldRequiredts = require.extensions[".ts"];
        });

        it("Should not be possible to install more than one", () => {
            toolchain().withTsconfig(tsConfig).install();
            expect(() => toolchain().withTsconfig(tsConfig).install())
                .toThrowError(AssertionError, "TSST JIT Compiler already installed.");
        });
        it("Should transpile ts to js on the fly", () => {
            const result = toolchain().withTsconfig(tsConfig).install();
            expect(result).toBe(0);
            expect(require(tsFileName).default).toBe("TRANSPILED");
        });

        afterEach(() => {
            require.extensions[".ts"] = oldRequiredts;
            Module._resolveFilename = oldFileNameResolver;
            delete (global as any).__TSST_INSTALLED__;
        });
    });

    afterAll((done) => {
        unlink(tsFileName, (err) => {
            if (err) {
                done.fail(err);
            } else {
                unlink(tsConfig, (err) => {
                    (done as any)(err || null);
                });
            }
        });
    });
});
