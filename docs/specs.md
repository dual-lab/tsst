# Specs

> - **Name** @dual-lab/tsst
> - **Version** 1.0.0
> - **Host** Node js

**tsst** stay for _typescript simple transpiler_. Is a collection of api that could be used to build
typescript project, in _AOT_ or _JIT_ mode.

We create this project in order to not duplicate this code during ours projects.

The module is base on the [typescript compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API),
used inside _rxjs_ Observable pattern.

- [build](specs/build.md) - build specification
- [test](specs/test.md) - testing specification
- [module](specs/module.md) - principal module specification

## Credits

Special thanks to

- [typescript](https://github.com/Microsoft/TypeScript) for Compiler APi
- [ts-node](https://github.com/TypeStrong/ts-node) for jit simple compilation
- [angular-cli](https://github.com/angular/angular-cli/) for the commit husky hook and "monky patch" of `require['.ts']` ideas
