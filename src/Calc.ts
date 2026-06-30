export interface Calc {
  attackers: {
    stats: Attacker;
    count: number;
  }[];
  defenders: {
    stats: Defender;
    count: number;
  };
}

export interface Attacker {
  attacks: string;
  skill: number;
  pow: number;
  boostATK?: boolean;
  boostDMG?: boolean;
}

export interface Defender {
  def: number;
  arm: number;
  hp: number;
  impervious?: boolean;
}
