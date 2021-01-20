export interface Node {
  id: string;
  text: string;
  children?: [Node];
  attributes?: StringKeyObject;
}
export interface FlattenNode {
  id: string;
  text: string;
  parentId?: string;
  attributes?: StringKeyObject;
}

export type StringKeyObject = { [key: string]: any };
