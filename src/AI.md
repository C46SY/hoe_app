# 项目AI上下文大纲

## 项目概述

### 项目名称
Hoe-App (暂定)

### 核心目标
构建一个基于Vue 3 + TypeScript + Pinia的现代化前端应用

### 技术特色
接口驱动的架构设计，高度解耦的组件系统

### 目标用户
需要复杂状态管理和可复用组件体系的开发团队

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **状态管理**: Pinia (基于接口的store设计)
- **构建工具**: Vite
- **样式方案**: CSS/SCSS
- **其他重要库**: 自定义核心对象库

# 项目结构说明

## CORE
核心对象库，包含一些常用的工具函数和对象

### OBJECT

#### CARD
**核心游戏对象系统**

**类结构**:
- `Card` (抽象类): 所有游戏对象的基类
- `BaseCard`: 带有随机属性的示例卡片实现
- `EmptyCard`: 空卡片单例，用于默认显示

**核心特性**:
- **属性管理**: 内置基础卡片表(CARD)管理核心属性
- **多表格支持**: 支持多个属性表(tables)管理不同维度数据
- **槽系统**: 支持装备、背包等槽位管理(slots)
- **唯一性控制**: sole属性控制表格的唯一性和冲突检测

**基础属性字段**:
```typescript
public static readonly att = {
  name: "CARD_NAME",      // 卡片名称
  system: "CARD_SYSTEM",  // 所属系统  
  type: "CARD_TYPE",      // 卡片类型
  des: "CARD_DES",        // 卡片描述
  pic: "CARD_PIC",        // 卡片图片路径
} as const;
```

**主要方法**:
- `setName()/getName()`: 名称管理
- `setType()/getType()`: 类型管理  
- `setSystem()/getSystem()`: 系统管理
- `setDes()/getDes()`: 描述管理
- `setPic()/getPic()`: 图片路径管理
- `addTable()/getTable()`: 表格管理
- `addSlot()/getKeySlot()/getBoxSlot()`: 槽位管理
- `get()/set()/alter()`: 属性操作

**设计模式**:
- 组合模式: 通过tables和slots组合复杂对象
- 策略模式: limit()方法实现自定义限制逻辑
- 工厂模式: BaseCard提供示例对象创建

#### TABLE