import { checkItemIsDigit } from "./utils";

describe('UsersService', () => {
    it("should check item is digit", () => {
        expect(checkItemIsDigit("23", -1)).toEqual(23);
        expect(checkItemIsDigit("r", -1)).toEqual(-1);
    });
});
