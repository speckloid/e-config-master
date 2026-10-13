import { Challenge, ElementData, GameSettings, RepresentationType } from '../types/chemistry';
import { ELEMENTS_1_TO_36, ELEMENT_BY_Z } from '../data/elements';
import { VALIDATED_IONS } from '../data/ions';

export function generateChallenge(settings: GameSettings, previousElementZ?: number): Challenge {
  const availableElements = ELEMENTS_1_TO_36.filter(el => el.period <= settings.maxPeriod);

  // Decide if this challenge tests an Ion
  const allowIons = settings.speciesMode === 'atoms_and_ions';
  const matchingIons = allowIons
    ? VALIDATED_IONS.filter(ion => {
        const el = ELEMENT_BY_Z[ion.elementZ];
        return el && el.period <= settings.maxPeriod;
      })
    : [];

  const shouldBeIon = allowIons && matchingIons.length > 0 && Math.random() < 0.38;

  let targetElement: ElementData;
  let isIon = false;
  let ionData = undefined;

  if (shouldBeIon) {
    // Pick an ion (avoid repeating exact same element if possible)
    const candidates = matchingIons.filter(i => i.elementZ !== previousElementZ);
    const chosenIon = (candidates.length > 0 ? candidates : matchingIons)[
      Math.floor(Math.random() * (candidates.length > 0 ? candidates.length : matchingIons.length))
    ];

    targetElement = ELEMENT_BY_Z[chosenIon.elementZ];
    isIon = true;
    ionData = chosenIon;
  } else {
    // Pick a neutral element
    const candidates = availableElements.filter(el => el.atomicNumber !== previousElementZ);
    targetElement = (candidates.length > 0 ? candidates : availableElements)[
      Math.floor(Math.random() * (candidates.length > 0 ? candidates.length : availableElements.length))
    ];
  }

  // Pick one representation at random from those enabled in the game setup
  const allowed = settings.allowedRepresentations && settings.allowedRepresentations.length > 0
    ? settings.allowedRepresentations
    : ['bohr_shell' as RepresentationType];

  const representation: RepresentationType = allowed[Math.floor(Math.random() * allowed.length)];

  const promptQuestion = isIon
    ? `Identify the element that forms this ${ionData?.speciesName || 'ion'}:`
    : 'Identify the element with this electronic structure:';

  return {
    id: `ch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    element: targetElement,
    isIon,
    ionData,
    representation,
    promptQuestion,
  };
}
