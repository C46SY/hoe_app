import { defineStore } from "pinia";
import { GUID } from "core/object/utils";
import { GAME } from "core/object/data";
import { Role } from "game/object/card/role";
import { RPG_TPGame } from "game/object/table/RPG_TPGame"
// STORE

// MINIROLE
export interface IStateMiniRole {
}
export interface IMiniRole {
  getHp(guid: GUID): number;
  getMp(guid: GUID): number;
  getSp(guid: GUID): number;
  getPic(guid: GUID): string;
}


// TestMiniRole
/** ISTATE接口 */
interface IState extends IStateMiniRole { }

/** IStore接口 */
interface IStore extends IState, IMiniRole { }

export const StoreTestMiniRole = defineStore("StoreTestMiniRole", {
  state: (): IState => ({
    guid: ''
  }),
  actions: {
    getHp(guid: GUID): number {
      const role = GAME.get(guid) as Role
      const hp = role.get<number>(RPG_TPGame.Att.HP)!
      const max_hp = role.get<number>(RPG_TPGame.Att.HP_MAX)!
      return hp / max_hp
    },
    getMp(guid: GUID): number {
      const role = GAME.get(guid) as Role
      const mp = role.get<number>(RPG_TPGame.Att.MP)!
      const max_mp = role.get<number>(RPG_TPGame.Att.MP_MAX)!
      return mp / max_mp
    },
    getSp(guid: GUID): number {
      const role = GAME.get(guid) as Role
      const sp = role.get<number>(RPG_TPGame.Att.SP)!
      console.log('getSp',sp)
      return sp / 10000
    },
    getPic(guid: GUID): string {
      const role = GAME.get(guid) as Role
      return role.pic
    }
  } as IStore,
});
