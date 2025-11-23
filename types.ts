
export type Language = 'en' | 'bn';

export enum PlantHealthStatus {
  HEALTHY = "Healthy",
  DISEASED = "Diseased",
  PEST_INFESTED = "Pest Infested",
  NUTRIENT_DEFICIENT = "Nutrient Deficient",
  UNKNOWN = "Unknown"
}

export interface Taxonomy {
  genus: string;
  family: string;
  order: string;
}

export interface Morphology {
  leaves: string;
  flowers: string;
  fruits: string;
  stems: string;
  roots: string; 
  nectar?: string;
}

export interface SmartCare {
  waterAmount: string; // e.g. "250ml"
  waterFrequency: string; // e.g. "Every 5 days"
  sunlightLux: string; // e.g. "500-1000 lux"
  potSizeAnalysis: string; // "Pot is suitable" or "Too small"
  fertilizerSchedule: string;
  soilMix: string;
  pruning: string;
  temperature: string;
}

export interface EcologicalInfo {
  nativeRegion: string;
  habitat: string;
  role: string;
  companions: string[]; 
}

export interface SafetyProfile {
  isPoisonous: boolean;
  poisonDetails: string; 
  isInvasive: boolean;
  isEndangered: boolean;
  isMedicinal: boolean;
  medicinalUses: string; 
  notes: string;
  consumption: string;
}

export interface SimilarSpecies {
  name: string;
  difference: string;
}

export interface DiagnosticResult {
  status: PlantHealthStatus;
  details: string;
  treatment: string;
  prevention: string; 
}

export interface RescuePlan {
  isNeeded: boolean;
  step1: string;
  step2: string;
  step3: string;
}

export interface Folklore {
  origin: string;
  stories: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PlantUpdate {
  id: string;
  timestamp: number;
  imageUrl: string;
  growthAnalysis: string;
  healthStatus: string;
}

// --- NEW TYPES FOR TOOLBOX ---

export interface ToolResult {
  toolId: string;
  timestamp: number;
  imageUrl: string;
  title: string;
  score?: number; // 0-100 or -1 if N/A
  status: string; // "Good", "Warning", "Critical"
  analysis: string;
  actionPlan: string[];
  prediction?: string;
}

export interface PlantTool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'health' | 'care' | 'environment' | 'growth' | 'fun';
  cameraInstruction: string;
  aiSystemPrompt: string;
}

export interface PlantIdentification {
  id: string;
  scientificName: string;
  commonNames: string[];
  confidence: number;
  description: string;
  benefits: string;
  reasoning: string;
  taxonomy: Taxonomy;
  morphology: Morphology;
  care: SmartCare; // Updated to SmartCare
  ecology: EcologicalInfo;
  safety: SafetyProfile;
  diagnostics: DiagnosticResult;
  similarSpecies: SimilarSpecies[];
  folklore: Folklore; 
  timestamp: number;
  imageUrl: string; 
  language: Language; 
  updates?: PlantUpdate[];
  chatHistory?: ChatMessage[];
  toolHistory?: ToolResult[]; // New
  
  // New Features
  healthScore: number; // 0-100
  personality: string; // e.g. "The Survivor", "Drama Queen"
  lifespanPrediction: string; // e.g. "High probability of survival next 30 days"
  rescuePlan?: RescuePlan;
}

export interface AppState {
  history: PlantIdentification[];
  currentScan: PlantIdentification | null;
  isAnalyzing: boolean;
  error: string | null;
  language: Language;
  isOffline: boolean;
}
