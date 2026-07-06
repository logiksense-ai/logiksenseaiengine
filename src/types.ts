export interface Signal {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  weight: number;
  description: string;
  evidence: string;
  searchIntentKeyword?: string;
}

export interface TechStack {
  category: string;
  name: string;
  version?: string;
  confidence: number;
}

export interface JobOpening {
  title: string;
  department: string;
  postedDate: string;
  inferredNeed: string;
  serviceAngle: string;
  description: string;
}

export interface WebDiff {
  page: string;
  changeType: 'addition' | 'removal' | 'modification';
  timestamp: string;
  summary: string;
  details: string;
}

export interface BuyingCommitteeMember {
  name: string;
  role: 'Economic Buyer' | 'Champion' | 'User' | 'Blocker';
  title: string;
  influence: 'High' | 'Medium' | 'Low' | 'Negative';
  status: 'Engaged' | 'Contacted' | 'Unreached' | 'Blocked';
}

export interface MeddpiccScorecard {
  metrics: boolean;
  economicBuyer: boolean;
  decisionCriteria: boolean;
  decisionProcess: boolean;
  paperProcess: boolean;
  identifyPain: boolean;
  champion: boolean;
  competition: boolean;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  revenue: string;
  headcount: number;
  intentScore: number;
  classification: 'Cold' | 'Warm' | 'High Intent' | 'Immediate Opportunity';
  targetTier: 'Enterprise' | 'SMB';
  country: string;
  registrySource: string;
  hasDigitalGap?: boolean;
  icpGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  winProbability: number;
  meddpicc?: MeddpiccScorecard;
  committee?: BuyingCommitteeMember[];
  signals: Signal[];
  techStack: TechStack[];
  jobs: JobOpening[];
  webDiffs: WebDiff[];
  riskSummary: string;
  oppSummary: string;
}

export interface AgentStatus {
  id: number;
  name: string;
  tier: 'Enterprise' | 'SMB/Local' | 'Deal Intelligence';
  responsibilities: string;
  outputType: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  lastRun: string;
  logCount: number;
}

export interface LogEntry {
  timestamp: string;
  agentId: number;
  type: 'info' | 'warn' | 'success' | 'error';
  message: string;
}

export interface SearchIntentTrend {
  keyword: string;
  category: string;
  growthPercentage: number;
  region: string;
  monthlyVolume: number;
}

export interface ICPTemplate {
  targetIndustries: string[];
  minHeadcount: number;
  maxHeadcount: number;
  requiredTech: string[];
  minIntentScore: number;
}
