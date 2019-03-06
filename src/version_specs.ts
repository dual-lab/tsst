import { Version } from "./version";

describe("Version class", () => {
    it("Should fail on parse not semver string", () => {
        expect(() => new Version("1.2_23")).toThrowError();
    });
    it("Should parse semver string", () => {
        const ver = new Version("1.2.3");
        expect(ver.getMajor).toBe(1);
        expect(ver.getMinor).toBe(2);
        expect(ver.getPatch).toBe(3);
    });
    it("Should compare other semver string", () => {
        const ver = new Version("1.2.3");
        expect(ver.isEqual("1.2.3")).toBe(true);
        expect(ver.isBelow("1.2.4")).toBe(true);
        expect(ver.isBelow("1.1.4")).toBe(false);
        expect(ver.isAbove("1.2.2")).toBe(true);
        expect(ver.isAbove("1.2.4")).toBe(false);
    });
});
