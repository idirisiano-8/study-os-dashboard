// Keyword-matched resource suggestions. Deliberately simple — we have no way
// to know what you've already read, so this is a starting point per topic,
// not a personalized recommendation. Extend the list as your subjects change.
const RESOURCE_MAP = [
  { match: /renal/i, resources: ["Guyton — Renal chapters", "Boards & Beyond: Renal", "BRS Physiology: Renal questions"] },
  { match: /cardio|cv\b/i, resources: ["Guyton — Cardiovascular chapters", "Boards & Beyond: Cardiovascular"] },
  { match: /pulm|resp/i, resources: ["Guyton — Respiratory chapters", "Boards & Beyond: Pulmonary"] },
  { match: /biochem/i, resources: ["Harper's — relevant chapter", "Anki maintenance pass", "Targeted question set"] },
  { match: /neuro/i, resources: ["Boards & Beyond: Neurology", "Neuroanatomy atlas review"] },
  { match: /gi|gastro/i, resources: ["Guyton — GI chapters", "Boards & Beyond: Gastrointestinal"] },
  { match: /endo/i, resources: ["Boards & Beyond: Endocrine", "Guyton — Endocrine chapters"] },
  { match: /micro/i, resources: ["Sketchy or org chart review", "Boards & Beyond: Microbiology"] },
  { match: /pharm/i, resources: ["Drug mechanism review", "Boards & Beyond: Pharmacology"] },
];

const DEFAULT_RESOURCES = ["Boards & Beyond — matching section", "Relevant textbook chapter", "Tagged Anki cards for this topic"];

export function resourcesFor(deckName) {
  const hit = RESOURCE_MAP.find((r) => r.match.test(deckName));
  return hit ? hit.resources : DEFAULT_RESOURCES;
}
