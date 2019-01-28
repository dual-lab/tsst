# Specs - Test

This specs is about testing the module API. The process is base on _Jasmine_ framwork.

## Configuration

The gulps task for testing, use the API of the library to execute all the _specs_.

1. Require jasmine module
2. Create a new instance
3. add  _jasmine-spec-reporter_
4. listen on complete event, ending the _Promise_ with success if `passed === true` or
   rejecting it.
5. start the execution with a list of files to test.

## Specs Structure

Every module api has its specific files **_spec.ts** containing the suites and the specs.
Principal suites test:

1. **Transpiler AOT**
    1. _should compile a ts module_
2. **Transpiler JIT**
    1. _shoulde compiler a ts module on the fly_

> **NB**: possible other minor specs. Testing helper functionalities.
