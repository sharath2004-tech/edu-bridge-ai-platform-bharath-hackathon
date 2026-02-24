// Chemistry reactions engine for lab experiments

export const REACTIVITY_SERIES = [
  { metal: 'Potassium', symbol: 'K', position: 1 },
  { metal: 'Sodium', symbol: 'Na', position: 2 },
  { metal: 'Calcium', symbol: 'Ca', position: 3 },
  { metal: 'Magnesium', symbol: 'Mg', position: 4 },
  { metal: 'Aluminum', symbol: 'Al', position: 5 },
  { metal: 'Zinc', symbol: 'Zn', position: 6 },
  { metal: 'Iron', symbol: 'Fe', position: 7 },
  { metal: 'Lead', symbol: 'Pb', position: 8 },
  { metal: 'Copper', symbol: 'Cu', position: 9 },
  { metal: 'Silver', symbol: 'Ag', position: 10 },
  { metal: 'Gold', symbol: 'Au', position: 11 },
]

export function checkMetalReactivity(metal: string, acid: string) {
  const metalData = REACTIVITY_SERIES.find(m => m.metal === metal)
  
  if (!metalData) {
    return {
      reactionOccurs: false,
      hydrogenReleased: false,
      reactivityPosition: 0,
      observation: 'Metal not found in reactivity series'
    }
  }

  // Metals above hydrogen (position < 8) react with acids
  const reactionOccurs = metalData.position <= 7
  const hydrogenReleased = reactionOccurs

  let observation = ''
  if (reactionOccurs) {
    if (metalData.position <= 3) {
      observation = `Vigorous reaction! ${metal} reacts violently with ${acid}, producing large amounts of hydrogen gas and heat.`
    } else if (metalData.position <= 6) {
      observation = `Moderate reaction. ${metal} reacts steadily with ${acid}, producing hydrogen gas bubbles.`
    } else {
      observation = `Slow reaction. ${metal} reacts slowly with ${acid}, producing small hydrogen gas bubbles.`
    }
  } else {
    observation = `No reaction. ${metal} is too unreactive to displace hydrogen from ${acid}.`
  }

  return {
    reactionOccurs,
    hydrogenReleased,
    reactivityPosition: metalData.position,
    observation
  }
}

interface Reaction {
  acid: string
  base: string
  equation: string
  type: string
  products: string[]
  temperatureChange: number
  phChange: {
    initial: number
    final: number
  }
}

const REACTIONS: Reaction[] = [
  {
    acid: 'HCl',
    base: 'NaOH',
    equation: 'HCl + NaOH → NaCl + H₂O',
    type: 'Neutralization',
    products: ['NaCl (Salt)', 'H₂O (Water)'],
    temperatureChange: 5.5,
    phChange: { initial: 1, final: 7 }
  },
  {
    acid: 'HCl',
    base: 'NH₄OH',
    equation: 'HCl + NH₄OH → NH₄Cl + H₂O',
    type: 'Neutralization',
    products: ['NH₄Cl (Ammonium Chloride)', 'H₂O (Water)'],
    temperatureChange: 4.2,
    phChange: { initial: 1, final: 7 }
  },
  {
    acid: 'H₂SO₄',
    base: 'NaOH',
    equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    type: 'Neutralization',
    products: ['Na₂SO₄ (Sodium Sulfate)', 'H₂O (Water)'],
    temperatureChange: 7.8,
    phChange: { initial: 0.5, final: 7 }
  },
  {
    acid: 'H₂SO₄',
    base: 'NH₄OH',
    equation: 'H₂SO₄ + 2NH₄OH → (NH₄)₂SO₄ + 2H₂O',
    type: 'Neutralization',
    products: ['(NH₄)₂SO₄ (Ammonium Sulfate)', 'H₂O (Water)'],
    temperatureChange: 6.1,
    phChange: { initial: 0.5, final: 7 }
  },
  {
    acid: 'CH₃COOH',
    base: 'NaOH',
    equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O',
    type: 'Neutralization',
    products: ['CH₃COONa (Sodium Acetate)', 'H₂O (Water)'],
    temperatureChange: 3.5,
    phChange: { initial: 3, final: 7 }
  },
  {
    acid: 'CH₃COOH',
    base: 'NH₄OH',
    equation: 'CH₃COOH + NH₄OH → CH₃COONH₄ + H₂O',
    type: 'Neutralization',
    products: ['CH₃COONH₄ (Ammonium Acetate)', 'H₂O (Water)'],
    temperatureChange: 2.8,
    phChange: { initial: 3, final: 7 }
  }
]

export function getReaction(acid: string, base: string): Reaction | null {
  return REACTIONS.find(r => r.acid === acid && r.base === base) || null
}
