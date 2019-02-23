export class Version {
    private major: number;
    private minor: number;
    private patch: number;

    constructor(semver: string) {
        const parts = this.parseSemver(semver);
        this.major = parts.major;
        this.minor = parts.minor;
        this.patch = parts.patch;

        if (isNaN(this.major) || isNaN(this.minor) || isNaN(this.patch)) {
            throw new Error(`The version string is not in the semver format.
Passed Format: ${semver}
Expected Format: x.x.x x:integer`);
        }
    }

    get getMajor() {
        return this.major;
    }

    get getMinor() {
        return this.minor;
    }

    get getPatch() {
        return this.patch;
    }

    isBelow(semver: string): boolean {
        const parsedSemver = this.parseSemver(semver);
        return this.major < parsedSemver.major ? true
            : this.major === parsedSemver.major ? this.minor < parsedSemver.minor ?
                true : this.minor === parsedSemver.minor ? this.patch < parsedSemver.patch : false
                : false;
    }

    isAbove(semver: string): boolean {
        const parsedSemver = this.parseSemver(semver);
        return this.major > parsedSemver.major ? true
            : this.major === parsedSemver.major ? this.minor > parsedSemver.minor ?
                true : this.minor === parsedSemver.minor ? this.patch > parsedSemver.patch : false
                : false;
    }

    isEqual(semver: string): boolean {
        const parsedSemver = this.parseSemver(semver);
        return this.major === parsedSemver.major
            && this.minor === parsedSemver.minor
            && this.patch === parsedSemver.patch;
    }

    toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    private parseSemver(semver: string): { major: number, minor: number; patch: number; } {
        const parts = semver.split(".");
        const major = +parts[0];
        const minor = +parts[1];
        const patch = parseInt(parts[2], 10);

        return { major, minor, patch };
    }
}
