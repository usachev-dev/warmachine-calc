export interface CalcIn {
  attackers: {
    stats: AttackerIn;
  }[];
  defenders: {
    stats: Defender;
    count: number;
  };
}

export interface Calc {
  attackers: {
    stats: Attacker;
  }[];
  defenders: {
    stats: Defender;
    count: number;
  };
}

export interface AttackerIn {
  attacks: string;
  skill: number;
  pow: number;
  boostATK?: boolean;
  boostDMG?: boolean;
}

export interface Attacker extends AttackerIn {
  attacksN: number;
  skill: number;
  pow: number;
  boostATK?: boolean;
  boostDMG?: boolean;
}

export function attackerInToAttacker(a: AttackerIn): Attacker {
  let attacksN = 0;
  if (/^\d+$/.test(a.attacks)) {
    attacksN = Number.parseInt(a.attacks);
  } else {
    let roll = parseDieRoll(a.attacks);
    attacksN = rollDice(roll);
  }
  return {
    attacksN,
    ...a,
  };
}

export function parseDieRoll(str: string): {
  count: number;
  d: number;
  plus: number;
} {
  let result = {
    count: 1,
    d: 0,
    plus: 0,
  };
  let s = str.replace(" ", "");
  let groups =
    /([\d]*?)([dD][\d]*)(([\+\-\*])[\d]*|([\+\-\*])\(([a-zA-Z]*)\))?/gim.exec(
      s,
    );
  if (!groups || groups.length < 2) return result;
  for (let i = 1; i < groups.length; i++) {
    let group = groups[i];
    if (!group) continue;
    let n = Number.parseInt(group);
    if (!Number.isNaN(n) && Number.isSafeInteger(n) && !result.d)
      result.count = n;
    if (group.includes("d") || (group.includes("D") && !result.d)) {
      let n = Number.parseInt(group.replace("d", "").replace("D", ""));
      if (!Number.isNaN(n) && Number.isSafeInteger(n)) result.d = n;
    }
    if (group.includes("+") && !result.plus) {
      let n = Number.parseInt(group.replace("+", ""));
      if (!Number.isNaN(n) && Number.isSafeInteger(n)) result.plus = n;
    }
  }
  return result;
}

export function rollDice(roll: {
  count: number;
  d: number;
  plus: number;
}): number {
  let result = 0;
  for (let i = 0; i < roll.count; i++) {
    result += rollDX(roll.d);
  }
  return result + roll.plus;
}

export interface Defender {
  def: number;
  arm: number;
  hp: number;
  currentHP?: number;
  impervious?: boolean;
}

export interface Report {
  avgDMG: number;
  medianKilled: number;
  attackersRequiredFor80PercentToKillAll: number;
}

export function rolld6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function rollDX(X: number): number {
  return Math.floor(Math.random() * X) + 1;
}

export class Roller {
  rolls: number[] = new Array(9999).fill(0).map((_) => rolld6());
  startingIndex: number = Math.floor(Math.random() * this.rolls.length);

  constructor() {}

  next(): number {
    if (this.startingIndex < this.rolls.length - 1) {
      return this.rolls[this.startingIndex++] as number;
    }
    this.startingIndex = Math.floor(Math.random() * this.rolls.length);
    return this.next();
  }

  rolld6(): number {
    return this.next();
  }

  roll2d6(): number {
    return this.next() + this.next();
  }

  roll3d6(): number {
    return this.next() + this.next() + this.next();
  }

  makeAtk(a: Attacker, d: Defender): { dmg: number; killed: number } {
    let dmg = 0;
    let killed = 0;
    for (let i = 0; i < a.attacksN; i++) {
      if (!d.currentHP) d.currentHP = d.hp;
      let hit = this.rollAtk(a.skill, d.def, a.boostATK);
      if (hit) {
        let result = this.rollDmg(a.pow, d.arm, a.boostDMG, d.impervious);
        dmg += Math.min(result, d.currentHP);
        d.currentHP = d.currentHP - dmg;

        if (d.currentHP <= 0) {
          d.currentHP = d.hp;
          killed++;
        }
      }
    }
    return { dmg, killed };
  }

  canHit(skill: number, def: number, boostATK?: boolean): boolean {
    return skill + (boostATK ? 18 : 12) >= def;
  }

  canDamage(
    pow: number,
    arm: number,
    boostDMG?: boolean,
    impervious?: boolean,
  ): boolean {
    return pow + (boostDMG ? 18 : 12) + (impervious ? -6 : 0) > arm;
  }

  canHurt(a: Attacker, d: Defender): boolean {
    return (
      this.canHit(a.skill, d.def, a.boostATK) &&
      this.canDamage(a.pow, d.arm, a.boostDMG, d.impervious)
    );
  }

  canHurtAtAll(attackers: Attacker[], d: Defender): boolean {
    return attackers.some((a) => this.canHurt(a, d));
  }

  rollAtk(skill: number, def: number, boostATK?: boolean): boolean {
    let roll = 0;
    if (boostATK) {
      roll = this.roll3d6();
    } else {
      roll = this.roll2d6();
    }
    return roll + skill >= def;
  }

  rollDmg(
    pow: number,
    arm: number,
    boostDMG?: boolean,
    impervious?: boolean,
  ): number {
    let roll = boostDMG ? this.roll3d6() : this.roll2d6();
    return Math.max(roll + pow - arm, 0);
  }
}

import { mean, median, quantile } from "simple-statistics";

export function makeReport(calcData: CalcIn): Report {
  let calc: Calc = {
    ...calcData,
    attackers: calcData.attackers.map((a) => ({
      stats: attackerInToAttacker(a.stats),
    })),
  };

  let roller = new Roller();

  if (
    !roller.canHurtAtAll(
      calc.attackers.map((a) => a.stats),
      calc.defenders.stats,
    )
  ) {
    return {
      avgDMG: 0,
      medianKilled: 0,
      attackersRequiredFor80PercentToKillAll: 0,
    };
  }

  let results: {
    dmg: number[];
    killed: number[];
    attackersToKillAll: number[];
  } = {
    dmg: [],
    killed: [],
    attackersToKillAll: [],
  };

  for (let i = 0; i < 9999; i++) {
    let localResults: {
      dmg: number;
      killed: number;
      attackersToKillAll: number;
    } = { dmg: 0, killed: 0, attackersToKillAll: 0 };
    let dmg = 0;
    let killed = 0;
    let count = 0;
    while (true) {
      for (let j = 0; j < calc.attackers.length; j++) {
        let a = calc.attackers[j] as { stats: Attacker };
        let { dmg: atkDmg, killed: atkKilled } = roller.makeAtk(
          a.stats,
          calc.defenders.stats,
        );
        dmg += atkDmg;
        killed += atkKilled;
      }
      count++;

      if (count === 1) {
        localResults.dmg = dmg;
        localResults.killed = killed;
      }

      if (killed >= calc.defenders.count) {
        calc.defenders.stats.currentHP = calc.defenders.stats.hp;
        localResults.attackersToKillAll = count;
        results.attackersToKillAll.push(count);
        results.dmg.push(localResults.dmg);
        results.killed.push(localResults.killed);
        break;
      }
    }
  }

  return {
    avgDMG: mean(results.dmg),
    medianKilled: median(results.killed),
    attackersRequiredFor80PercentToKillAll: quantile(
      results.attackersToKillAll,
      0.8,
    ),
  };
}
