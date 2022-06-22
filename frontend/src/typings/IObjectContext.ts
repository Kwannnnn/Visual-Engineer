interface IObjectContext {
  boardId: number;
  id: string;
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
  x: number;
  y: number;
}

export default IObjectContext;
