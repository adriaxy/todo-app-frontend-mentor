/**
 * @jest-environment jsdom
 */
import {createNewItem,
    updateItemsLeftUI,
    changeClassVisibility,
    changeCompletedState
} from './dom.js'

describe('Change class visibility', ()=> {
    test('remove hide class when flag is equal to completed:false', ()=> {
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
        ]   
        const li = document.createElement('li');
        li.id = '1';
        changeClassVisibility(li, listItems, false);
        expect(li.classList.contains('show')).toBe(true)
    })

    test('remove show class when flag is not equal to completed', ()=> {
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
        ]   
        const li = document.createElement('li');
        li.id = '2';
        changeClassVisibility(li, listItems, false);
        expect(li.classList.contains('hide')).toBe(true)
    })
})

describe('Update items left UI', ()=> {
    test('update text content of span', ()=> {
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
    ]
    const textElement = document.createElement('span');
    updateItemsLeftUI(textElement, listItems);
    expect(textElement.textContent).toBe('2')
    });
})

describe('Creates new item to the list', ()=> {
    test('returns 1 when creating a new item', ()=> {
        const input = {value:'text1'}
        const listItems = [];
        createNewItem(listItems, input)
        expect(listItems.length).toBe(1);
    });

    test('returns expected text', ()=> {
        const placeholder = 'text2'
        const input = {value:placeholder}
        const listItems = [];
        createNewItem(listItems, input)
        expect(listItems[0].text).toBe(placeholder);
    });

    test('new item has completed set to false', ()=> {
        const input = {value:'text3'}
        const listItems = [];
        createNewItem(listItems, input)
        expect(listItems[0].completed).toBe(false);
    });

    test('new item has expected text when listItems is not empty', ()=> {
        const placeholder = 'text4'
        const input = {value:placeholder}
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
        createNewItem(listItems, input);
        expect(listItems.length).toBe(4);
        expect(listItems[0].text).toBe(placeholder);
        expect(listItems[0].completed).toBe(false);
        expect(listItems[1].text).toBe('text1');
    });
});

describe('Creates new item and updates items left UI', ()=> {
    test('Creates new item and updates items left UI', ()=> {
        const listItems = [];
        const input = {value:'text5'};
        const textElement = document.createElement('span');

        createNewItem(listItems, input);
        updateItemsLeftUI(textElement, listItems);

        expect(listItems.length).toBe(1);
        expect(listItems[0].text).toBe('text5');
        expect(listItems[0].completed).toBe(false);
        expect(textElement.textContent).toBe('1')
    })
})

describe('Toggle completed state', ()=> {
    test('change completed state to true when index is found on the list', ()=> {
        const id = '3';
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
        ]
        
        changeCompletedState(listItems, id);
        expect(listItems[2].completed).toBe(true);
    });

    test('change completed state to false when index is found on the list', ()=> {
        const id = '1';
        const listItems = [
        {
            text: 'text1',
            completed: true,
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
        ]
        
        changeCompletedState(listItems, id);
        expect(listItems[0].completed).toBe(false);
    });

    test('returns "index not found" when the id is not on the list', ()=> {
        const id = '4';
        const listItems = [
        {
            text: 'text1',
            completed: true,
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
        ]
        
        let result = changeCompletedState(listItems, id);
        expect(result).toBe(null);
    });

    test('returns "index not found" when the list is empty', ()=> {
        const id = '4';
        const listItems = [];
        let result = changeCompletedState(listItems, id);
        expect(result).toBe(null);
    });

    
    test('change completed state to false when the element is clicked and index is found on the list', ()=> {
        const listItems = [
        {
            text: 'text1',
            completed: true,
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
        ]
        const li = document.createElement('li');
        li.id = '1';
        const id = li.id;
        li.addEventListener('click', ()=> {changeCompletedState(listItems, id)});
        li.click();
        
        expect(listItems[0].completed).toBe(false);
    });
})