import { expect, describe, it } from 'vitest';


let testArray = [
    {familyName: 'Zabato'},
    {familyName: 'Leonetti'},
    {familyName: 'MacDonald'},
    {familyName: 'Douglas'}
]

const comparePerson = (a, b) => {
    if (a.familyName[0].toLowerCase() < b.familyName[0].toLowerCase()) {
      return -1;
    }
    if (a.familyName[0].toLowerCase() > b.familyName[0].toLowerCase()) {
      return 1;
    }
    return 0;
};



describe('Sorting', ()=> {
    it('array should be sorted by familyName', () => {
        const results = [...testArray].sort(comparePerson)
        
        testArray.sort(comparePerson)
        expect(results).toStrictEqual([...testArray].sort(comparePerson))
    })
})