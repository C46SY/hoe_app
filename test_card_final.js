// 最终测试 - 参考Table的fromJSON实现
class Table {
    static fromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        const instance = new this();
        
        // 获取实例的所有属性
        const allProperties = new Set();
        let current = instance;
        
        while (current && current !== Object.prototype) {
            Object.getOwnPropertyNames(current).forEach(prop => {
                if (prop !== 'constructor' && prop !== 'fromJSON' && 
                    typeof current[prop] !== 'function') {
                    allProperties.add(prop);
                }
            });
            current = Object.getPrototypeOf(current);
        }
        
        // 只赋值数据中存在的属性
        allProperties.forEach(key => {
            if (data.hasOwnProperty(key)) {
                instance[key] = data[key];
            }
        });
        
        return instance;
    }
}

class B extends Table {
    _hp = 100;

    set hp(value) {
        if (value < 0) value = 0;
        this._hp = value;
    }
    get hp() {
        return this._hp;
    }
}

class C extends Table {
    _mp = 100;

    set mp(value) {
        if (value < 0) value = 0;
        this._mp = value;
    }
    get mp() {
        return this._mp;
    }
}

class Card {
    type = 'Card';
    tableTypes = [];
    exp = 0;
    tp = 0;

    constructor() {
        this.type = this.constructor.name;
    }

    add(table) {
        if (!this.tableTypes.includes(table.constructor.name)) {
            this.tableTypes.push(table.constructor.name);
        }
        
        // 先复制实例属性
        Object.assign(this, table);
        
        // 然后复制属性描述符
        const descriptors = Object.getOwnPropertyDescriptors(table);
        Object.defineProperties(this, descriptors);
        
        return this;
    }

    data() {
        return JSON.stringify(this);
    }

    static fromData(jsonString) {
        const data = JSON.parse(jsonString);
        const card = new Card();
        
        // 参考Table的fromJSON实现
        const allProperties = new Set();
        let current = card;
        
        while (current && current !== Object.prototype) {
            Object.getOwnPropertyNames(current).forEach(prop => {
                if (prop !== 'constructor' && prop !== 'fromData' && 
                    typeof current[prop] !== 'function') {
                    allProperties.add(prop);
                }
            });
            current = Object.getPrototypeOf(current);
        }
        
        // 只赋值Card自身的属性
        allProperties.forEach(key => {
            if (data.hasOwnProperty(key)) {
                card[key] = data[key];
            }
        });
        
        return card;
    }
}

// 测试
console.log('=== 最终测试 ===');

const tb = B.fromJSON('{"_hp":100,"exp":0,"mp":9,"tp":9}');
const tc = C.fromJSON('{"_hp":100,"exp":0,"mp":9,"tp":9}');
console.log('tb:', tb);
console.log('tc:', tc);

const card = new Card().add(tb).add(tc);
console.log('card after add:', card);

// 测试setter是否工作
card.mp = -10;
console.log('card.mp after set to -10:', card.mp); // 应该显示0

card.mp = 99;
console.log('card.mp after set to 99:', card.mp); // 应该显示99

// 测试序列化和反序列化
const data = card.data();
console.log('serialized data:', data);

const card2 = Card.fromData(data);
console.log('card2 after fromData:', card2);

// 测试反序列化后的setter
card2.mp = -5;
console.log('card2.mp after set to -5:', card2.mp); // 应该显示0

card2.mp = 88;
console.log('card2.mp after set to 88:', card2.mp); // 应该显示88

console.log('=== 测试完成 ===');