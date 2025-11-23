
import { PlantTool } from "../types";

export const PLANT_TOOLS: PlantTool[] = [
  // --- HEALTH & DIAGNOSTICS ---
  {
    id: 'soil-scanner',
    name: 'Smart Soil Scanner',
    description: 'Analyze soil texture, moisture, and quality.',
    iconName: 'Layers',
    category: 'health',
    cameraInstruction: 'Take a close-up, clear photo of the soil surface.',
    aiSystemPrompt: 'You are a Soil Scientist. Analyze the soil image for texture (loamy, clay, sandy), organic matter, compaction, and potential moisture level. Predict nutrient issues based on visual crusting or color.'
  },
  {
    id: 'root-health',
    name: 'Root Health Estimator',
    description: 'Infer root health from plant/soil signals.',
    iconName: 'MoveDown',
    category: 'health',
    cameraInstruction: 'Photograph the base of the stem meeting the soil.',
    aiSystemPrompt: 'You are an expert Botanist. Infer root health based on the stem base condition, soil crusting, and visible surface roots. Look for rot at the collar.'
  },
  {
    id: 'nutrient-deficiency',
    name: 'Nutrient Deficiency Predictor',
    description: 'Detect early signs of NPK issues.',
    iconName: 'TestTube',
    category: 'health',
    cameraInstruction: 'Photograph leaves showing discoloration or veins.',
    aiSystemPrompt: 'You are a Plant Nutritionist. Analyze leaf chlorosis patterns (interveinal vs total) to predict Nitrogen, Phosphorus, Potassium, or Micronutrient deficiencies.'
  },
  {
    id: 'pest-egg-detector',
    name: 'Pest Egg Detector',
    description: 'Find tiny eggs or mites.',
    iconName: 'Bug',
    category: 'health',
    cameraInstruction: 'Use macro mode. Photo underside of leaves.',
    aiSystemPrompt: 'You are an Entomologist. Scan for tiny dots, webbing, or clusters that indicate spider mites, aphids, or scale insect eggs.'
  },
  {
    id: 'sunburn-risk',
    name: 'Sunburn Risk Detector',
    description: 'Spot early leaf burn signs.',
    iconName: 'Sun',
    category: 'health',
    cameraInstruction: 'Photo of leaves exposed to direct light.',
    aiSystemPrompt: 'Analyze leaves for bleaching, scorching, or crispy brown edges indicative of photo-oxidative stress (sunburn).'
  },
  
  // --- CARE & MAINTENANCE ---
  {
    id: 'pruning-advisor',
    name: 'AI Pruning Advisor',
    description: 'See exactly where to cut.',
    iconName: 'Scissors',
    category: 'care',
    cameraInstruction: 'Photo of the whole plant structure.',
    aiSystemPrompt: 'You are a Master Gardener. Identify dead, crossing, or leggy branches. Suggest specific pruning points to encourage bushier growth.'
  },
  {
    id: 'watering-volume',
    name: 'Watering Calculator',
    description: 'Exact ML amount needed.',
    iconName: 'Droplet',
    category: 'care',
    cameraInstruction: 'Photo of the entire pot and plant.',
    aiSystemPrompt: 'Estimate the pot volume based on visual scale. Calculate the precise water volume (in ml) needed to saturate the soil without waterlogging.'
  },
  {
    id: 'repotting-forecaster',
    name: 'Repotting Forecaster',
    description: 'Is it time to upgrade the pot?',
    iconName: 'Box',
    category: 'care',
    cameraInstruction: 'Photo of the plant relative to its pot.',
    aiSystemPrompt: 'Analyze the plant-to-pot ratio. If the plant is 3x the height of the pot or looks top-heavy, recommend repotting.'
  },
  {
    id: 'drainage-score',
    name: 'Pot Drainage Score',
    description: 'Evaluate pot suitability.',
    iconName: 'Disc',
    category: 'care',
    cameraInstruction: 'Photo of the bottom of the pot (if possible) or the pot style.',
    aiSystemPrompt: 'Analyze the pot material and design for drainage capability. Plastic holds water; Terra cotta breathes. Estimate drainage efficiency.'
  },
  {
    id: 'fertilizer-advisor',
    name: 'Adaptive Fertilizer',
    description: 'Custom NPK recipes.',
    iconName: 'Zap',
    category: 'care',
    cameraInstruction: 'Photo of the plant foliage.',
    aiSystemPrompt: 'Based on the plant type and current vegetative stage (leafy vs flowering), recommend the ideal NPK ratio (e.g., 10-10-10 vs 5-10-5).'
  },
  
  // --- ENVIRONMENT ---
  {
    id: 'humidity-checker',
    name: 'Humidity Suitability',
    description: 'Is it too dry here?',
    iconName: 'CloudRain',
    category: 'environment',
    cameraInstruction: 'Photo of the plant in its room environment.',
    aiSystemPrompt: 'Identify the plant species and its humidity needs. Look for signs of dry air stress (crispy tips). Assess if the environment looks like a dry AC room or humid spot.'
  },
  {
    id: 'grow-light',
    name: 'Grow Light Positioner',
    description: 'Optimize artificial light.',
    iconName: 'SunMedium',
    category: 'environment',
    cameraInstruction: 'Photo of the plant and the light source.',
    aiSystemPrompt: 'Analyze the distance between the plant canopy and the light source. Recommend if it needs to be closer or further to prevent burn or etiolation.'
  },
  {
    id: 'pot-material',
    name: 'Pot Material Analyzer',
    description: 'Plastic vs Ceramic vs Clay.',
    iconName: 'Box',
    category: 'environment',
    cameraInstruction: 'Close up of the pot texture.',
    aiSystemPrompt: 'Identify the pot material (Terra cotta, glazed ceramic, plastic). Explain how this specific material affects water retention for this plant.'
  },
  {
    id: 'seasonal-survival',
    name: 'Seasonal Survival',
    description: 'Winter survival probability.',
    iconName: 'ThermometerSun',
    category: 'environment',
    cameraInstruction: 'Photo of the plant.',
    aiSystemPrompt: 'Identify the plant hardiness. Predict its ability to survive indoors vs outdoors based on general winter sensitivity.'
  },
  
  // --- GROWTH & PROPAGATION ---
  {
    id: 'propagation-predictor',
    name: 'Propagation Success',
    description: 'Will this cutting root?',
    iconName: 'GitBranch',
    category: 'growth',
    cameraInstruction: 'Photo of the stem cutting or node.',
    aiSystemPrompt: 'Analyze the cutting. Does it have a healthy node? Is the stem woody or green? Predict the probability of successful rooting in water vs soil.'
  },
  {
    id: 'growth-speed',
    name: 'Growth Speed Estimator',
    description: 'cm per week prediction.',
    iconName: 'TrendingUp',
    category: 'growth',
    cameraInstruction: 'Full body photo of plant.',
    aiSystemPrompt: 'Identify the species growth habit (fast vine vs slow succulent). Estimate typical growth rate per week under ideal conditions.'
  },
  {
    id: 'harvest-detector',
    name: 'Harvest Readiness',
    description: 'Is it ready to pick?',
    iconName: 'Apple',
    category: 'growth',
    cameraInstruction: 'Photo of the fruit or vegetable.',
    aiSystemPrompt: 'Analyze color, size, and skin texture of the fruit/veg. Determine if it is under-ripe, ripe, or over-ripe.'
  },
  {
    id: 'leaf-shape-tracker',
    name: 'Leaf Evolution',
    description: 'Track shape changes.',
    iconName: 'Fingerprint',
    category: 'growth',
    cameraInstruction: 'Top-down photo of a new leaf.',
    aiSystemPrompt: 'Analyze the leaf morphology. Is it showing signs of deformity, curling, or healthy fenestration/expansion?'
  },

  // --- SAFETY & FUN ---
  {
    id: 'toxicity-scanner',
    name: 'Toxicity Scanner',
    description: 'Safe for Pets/Kids?',
    iconName: 'Skull',
    category: 'fun',
    cameraInstruction: 'Clear photo of the plant.',
    aiSystemPrompt: 'Identify the plant and strictly check toxicity databases. Is it toxic to cats, dogs, or humans? detailed symptoms.'
  },
  {
    id: 'nickname-generator',
    name: 'Plant Renamer',
    description: 'Generate a personality name.',
    iconName: 'Edit3',
    category: 'fun',
    cameraInstruction: 'Photo of the plant.',
    aiSystemPrompt: 'Analyze the plant "vibe" (spiky, flowing, cute, monster). Generate 3 fun names and a "Personality Archetype".'
  },
  {
    id: 'companion-advisor',
    name: 'Companion Planter',
    description: 'Who should live next door?',
    iconName: 'Users',
    category: 'fun',
    cameraInstruction: 'Photo of the plant.',
    aiSystemPrompt: 'Identify the plant. Suggest 3 best companion plants that share similar light/water needs and look good together.'
  },
];
