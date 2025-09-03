import { countActiveItems, findIndexItem} from './array.js';  // importamos la función a testear

describe('count active items', () => {
    const list1 = [
        {completed : true},
        {completed : false},
        {completed : true},
        {completed : true}
    ]

    const list2 = [
        {completed : true},
        {completed : true},
        {completed : true},
        {completed : true}
    ]

    const list3 = [];

    test('returns expected value', ()=> {
        expect(countActiveItems(list1)).toBe(1)
    })

    test('returns 0 if there is no object with completed:false', ()=> {
        expect(countActiveItems(list2)).toBe(0)
    })

    test('returns 0 if the list is empty', ()=> {
        expect(countActiveItems(list3)).toBe(0)
    })
});

describe('find index of item', ()=> {
    const listItems = [
        {
            text: 'text1',
            completed: false,
            id: 1,
        },
        {
            text: 'text2',
            completed: true,
            id: 2,
        },
        {
            text: 'text3',
            completed: false,
            id: 3,
        }
    ];

    const list3 = [];

    test('returns index of item by id', ()=> {
        expect(findIndexItem(listItems, 2, 'id')).toBe(1)
    });

    test('returns index of item by text', ()=> {
        expect(findIndexItem(listItems, 'text2', 'text')).toBe(1)
    });

    test('returns first indez when key is not unique', ()=> {
        expect(findIndexItem(listItems, false, 'completed')).toBe(0)
    });

    test('returns -1 when the list is empty', ()=> {
        expect(findIndexItem(list3, false, 'completed')).toBe(-1)
    });

    test('returns -1 when id is not found on the list', ()=> {
        expect(findIndexItem(listItems, 4, 'id')).toBe(-1)
    });
})

