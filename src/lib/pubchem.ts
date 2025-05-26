// lib/pubchem.ts
export async function searchDrugs(query: string) {
  const response = await fetch(
    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`
  );
  const data = await response.json();
  return data;
}

export async function getDrugDetails(cid: string) {
  const response = await fetch(
    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/JSON`
  );
  const data = await response.json();
  return data;
}

export async function getMolecule3D(cid: string) {
  const response = await fetch(
    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF`
  );

  const data = await response.text();
  return data;
}