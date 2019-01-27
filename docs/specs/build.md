# Specs - Bulid

This spec is about the buliding process of **tsst** module. All the process is base on _gulpjs_ for
build, testing, lint and prepublish tasks. The only task that is execute with a simple node js script
is the commit validation with husky hook.

## Gulpjs structure

All the gulp files is put inside a folder _gulpefile.js_ ([splitting gulp file](https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles#splitting-a-gulpfile)) splitting the
principal gulpfile.js in more modules.

The tasks are loaded with a custom _undertaker-registry_, that _require_ task on demand using the 
node module resolution algorithm.

- **index.js** entry point for _gulp-cli_
- **on-demand-registry.js** custom registry implementstion for loading on demand tasks
- **tasks** folder containing all the taks used in this project

### Tasks

Tasks are simple js function tha take the gulp instance as argument and return a function
that could be passed to the gulp tasks executor.

```typescript
interface Tasks {
    (gulp): (cb?) => void | Stream | Promise<any> | ChildProcess
}
```

### On demand registry

The on demand registry override the `get(...)` method of _undertaker-registry_ in a way that when the task in not
into the cache, it's loaded from the correct location using node resolve algo and then is add to the _gulp_ flow.

The custom registry has a refecence to the location of internal tasks, and a static ref of _gulp_ instance.

### Entry point

The entry point is the main input of _gulp-cli_, in which are defined the main tasks of the projects:

1. **build** -- Build all the project. Is a _series_ tasks of
    1. _clean_ -- clean the output folder
    2. _compile_ -- compile all the sources

2. **test** -- Testing the source files. Is a _series_ tasks of
    1. _build_ -- see above.
    2. _run-test_ -- run the test using Jasmine framework

3. **pre-publish** -- Pre publish formatting and testing. Is a _series_ tasks of
    1. _build_ -- see above
    2. _lint_ -- lint the source files
    3. _refactor-for-packing_ -- refact the compiled files name and directory structure.
