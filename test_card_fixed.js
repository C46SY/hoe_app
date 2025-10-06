// 正确的测试代码
class Table {
    static fromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        const instance = new this();
        
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                instance[key] = data[key];
            }
        }
        
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
        // 记录添加的table类型
        if (!this.tableTypes.includes(table.constructor.name)) {
            this.tableTypes.push(table.constructor.name);
        }
        
        // 复制所有属性（包括getter/setter）
        const descriptors = Object.getOwnPropertyDescriptors(table);
        Object.defineProperties(this, descriptors);
        
        // 复制实例属性
        Object.assign(this, table);
        
        return this;
    }

    data() {
        return JSON.stringify(this);
    }

    static fromData(jsonString) {
        const data = JSON.parse(jsonString);
        const card = new Card();
        
        // 恢复基础属性
        Object.assign(card, data);
        
        // 重新添加所有记录的table类型
        if (data.tableTypes) {
            data.tableTypes.forEach((tableType) => {
                switch (tableType) {
                    case 'B':
                        card.add(B.fromJSON(jsonString));
                        break;
                    case 'C':
                        card.add(C.fromJSON(jsonString));
                        break;
                }
            });
        }
        
        return card;
    }
}

// 测试
console.log('=== 开始测试 ===');

const tb = B.fromJSON('{"_hp":100,"exp":0,"mp":9,"tp":9}');
const tc = C.fromJSON('{"_hp":100,"exp":0,"mp":9,"tp":9}');
console.log('tb:', tb);
console.log('tc:', tc);

const card = new Card().add(tb).add(tc);
console.log('card after add:', card);

card.mp = -10;
console.log('card.mp after set to -10:', card.mp);

card.mp = 99;
console.log('card.mp after set to 99:', card.mp);

const data = card.data();
console.log('serialized data:', data);

const card2 = Card.fromData(data);
console.log('card2 after fromData:', card2);

card2.mp = -10;
console.log('card2.mp after set to -10:', card2.mp);

card2.mp = 99;
console.log('card2.mp after set to 99:', card2.mp);

console.log('=== 测试完成 ===');