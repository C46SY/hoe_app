import { Table } from "core/object/table";
import { KeySlot, BoxSlot } from "core/object/slot";
import { Card } from "core/object/card";

//==================================================
// TABLE
//--------------------------------------------------
export interface IStateTable {
  table: Table | undefined;
}
export interface ITable extends IStateTable {}
//==================================================

//==================================================
// KEYSLOT
//--------------------------------------------------
export interface IStateKeySlot {
  keySlot: KeySlot<Card> | undefined;
}
export interface IKeySlot extends IStateKeySlot {}
//==================================================

//==================================================
// BOXSLOT
//--------------------------------------------------
export interface IStateBoxSlot {
  boxSlot: BoxSlot<Card>;
  mainSelect: string[];
  minorSelect: string[];
}
export interface IBoxSlot extends IStateBoxSlot {}
//==================================================

//==================================================
// CARD
//--------------------------------------------------
export interface IStateCard {
  card: Card;
  table: Table | undefined;
  keyslot: KeySlot<Card> | undefined;
  boxslot: BoxSlot<Card> | undefined;
  listTable: string[];
  listKeySlot: string[];
  listBoxSlot: string[];

  storeKeySlot: Map<string, any>;
  storeBoxSlot: Map<string, any>;
}
export interface ICard extends IStateCard {
  preTable(): void;
  nextTable(): void;

  preKeySlot(): void;
  nextKeySlot(): void;

  preBoxSlot(): void;
  nextBoxSlot(): void;
}

//==================================================

//==================================================
// MiniMenu
//--------------------------------------------------
export interface IStateMiniMenu {
  select: any;
  menuItems: string[];
}
export interface IMiniMenu extends IStateMiniMenu {
  clickItem: (item: string) => void;
}
//==================================================
