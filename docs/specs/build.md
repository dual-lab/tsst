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

### Entry point