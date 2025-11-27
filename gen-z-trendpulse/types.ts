export enum Category {
  FASHION = 'Fashion',
  TECH = 'Tech',
  LIFESTYLE = 'Lifestyle',
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TrendItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  growthScore: number; // 0 to 100
  sentiment: 'Positive' | 'Neutral' | 'Mixed';
  prediction: string;
  marketStrategy: string; // Actionable insight
  productIdea: string; // Product dev suggestion
  sources?: GroundingSource[];
  historicalData: { month: string; value: number }[]; // For charts
}

export interface TrendResponse {
  trends: TrendItem[];
}
