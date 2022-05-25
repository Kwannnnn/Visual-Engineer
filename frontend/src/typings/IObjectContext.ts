interface IObjectContext {
  boardId: number;
  tag: string;
  name: string;
  length: number;
  width: number;
  depth: number;
  diameter: number;
  type: string;
  pressureClass: string;
  flange: number;
  lining: number;
  emptyMass: number;
  filledMass: number;
  head: number;
  netVolume: number;
  grossVolume: number;
  preliminaryPower: number;
  finalPower: number;
}

export default IObjectContext;
