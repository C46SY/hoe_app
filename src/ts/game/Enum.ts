/** 基础属性系统 */
enum STATUS_ATTR {
    /** 需求属性表 */
    NEED = 'NEED',
    /** 基础属性表 */
    ATTR = 'ATTR',
    /** 加法强化加成表 */
    ADD = 'ADD',
    /** 乘法强化倍率表 */
    MUL = 'MUL',
}

enum SKILL_ATTR {
    /** 技能属性表 */
    ATT = 'ATT',
    /** 技能消耗表 */
    COST = 'COST',
    /** 技能资源表 */
    RESOURCE = 'RESOURCE',
    /** 技能目标表 */
    TARGET = 'TARGET'
}

/** 基础卡片系统 */
enum SYSTEM_TYPE {
    SKILL = 'SKILL',
    EQUIP = 'EQUIP',
    STATUS = 'STATUS'
}

/** 技能 */
enum SKILL {
    WEIGHT = 'WEIGHT',
    POWER = 'POWER',
    TP = 'TP',
}



/** 状态 */
enum STATUS {
    /** 充能  */
    CHARGE = 'CHARGE',
    /** 周期 */
    CYCLE = 'CYCLE',
    /** TP */
    TP = 'TP',
    /** ALIVE */
    ALIVE = 'ALIVE'
}


/**
 * 技能目标表属性
 * NUM    - 目标数量
 * ATTR   - 用于排序的属性名
 * ORDER  - 排序顺序（true为升序，false为降序）
 * REPEAT - 是否允许目标重复
 * ENEMY  - 是否选取敌方（true为敌方，false为己方）
 */
enum SKILL_TARGET {
    /** 目标数量 */
    NUM = 'NUM',
    /** 排序属性 */
    ATTR = 'ATTR',
    /** 排序顺序（true升序，false降序） */
    ORDER = 'ORDER',
    /** 是否允许目标重复 */
    REPEAT = 'REPEAT',
    /** 是否选取敌方 */
    ENEMY = 'ENEMY'
}

