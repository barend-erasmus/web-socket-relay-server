import * as BigNumber from 'big-number';

export class BigNumberHelper {

    public static toString(value: BigNumber, baseCharacters: string[]): string {
        let result: string = '';
        const targetBase: number = baseCharacters.length;

        do {
            result = baseCharacters[value.mod(targetBase)] + result;
            value = value.divide(targetBase);
        } while (value.gt(0));

        return result;
    }

}
