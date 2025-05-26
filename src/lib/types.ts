// lib/types.ts
export interface DrugResult {
  cid: number;
  name: string;
}

export interface DrugCompound {
  id: {
    id: {
      cid: number;
    };
  };
  props: DrugProperty[];
  synonyms?: string[];
}

export interface DrugProperty {
  urn: {
    label: string;
    name: string;
    datatype: number;
  };
  value: {
    sval?: string;
    ival?: number;
    fval?: number;
    binary?: string;
  };
}

export interface DrugDetails {
  PC_Compounds: DrugCompound[];
}

export interface MoleculeData {
  data: string;
}

// New types for drug interaction feature
export interface DrugInteraction {
  drugs: string[];
  effect: string;
  mechanism: string;
  severity: "Mild" | "Moderate" | "Severe" | string;
  recommendation: string;
}

export interface DrugInteractionAnalysis {
  summary: string;
  interactions: DrugInteraction[];
  severity: "none" | "Mild" | "Moderate" | "Severe" | "unknown" | string;
  recommendation: string;
}
