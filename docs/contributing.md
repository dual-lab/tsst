# Contributing

## For feat bug-fix.

1. create a local branch of name _fix$number-issue\_$milestone_ from _experiment_ is the bug will be fixed in the 
   next rel. Otherwise create one branch from master _fix$number-issue\_$fixing-version_, after testing and resolving
   the bug.

   1. create one commit for the fixing code.
   2. create one commit for the testing code.
   3. rebase master onto this branch
   4. _cherry pick_ first commit into _experiment_ and the second into _testing_

2. push the branch if necessary
3. create a merge request into _experiment_ branch (only admin can merge local iusse branch into _experiment_)

## For feat iusse.

1. create a local branch of name _feat$number-issue\_$milestone_ from _experiment_
2. push the branch if necessary
3. create a merge request into _experiment_ branch (only admin can merge local iusse branch into _experiment_)

## For test iusse.

1. create a testing iusse
2. create a local branch of name _test$number-issue\_$milestone_ from _testing_
3. create a merge request into _testing_ branch (only admin can merge local iusse branch into _testing_)

When the mileston is completed create a merge request from _testing_ to _master_.

## Create new issues

- [Bug](https://github.com/dual-lab/tsst/issues/new?template=Bug.md) - bug fixing request
- [Feat](https://github.com/dual-lab/tsst/issues/new?template=Feat.md) - proposal request
- [Test](https://github.com/dual-lab/tsst/issues/new?template=Test.md) - testing feature

## Create pull requests

- [TEST-TO-MASTER](https://github.com/dual-lab/tsst/pull/new/testing?template=Pull_Request.md)
