/// <reference types="node" />

declare namespace stringarray {
  interface StringArray  {
    objectToBin(obj: object): Uint8Array;
    binToObject(bin: Uint8Array): object;
  }
}

declare const stringarray: stringarray.StringArray;
export = stringarray;
