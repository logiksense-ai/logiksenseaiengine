import type { Company, AgentStatus, LogEntry, SearchIntentTrend, ICPTemplate } from './types';

export const defaultICPTemplate: ICPTemplate = {
  targetIndustries: ['Financial Technology', 'Software Engineering', 'Manufacturing', 'Trades & Construction'],
  minHeadcount: 5,
  maxHeadcount: 500,
  requiredTech: ['AWS', 'Salesforce', 'Xero'],
  minIntentScore: 50
};

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Apex Finance Systems',
    domain: 'apexfinance.io',
    industry: 'Financial Technology',
    revenue: '$45M - $50M',
    headcount: 142,
    intentScore: 98,
    classification: 'Immediate Opportunity',
    targetTier: 'Enterprise',
    country: 'Australia',
    registrySource: 'ASIC Company Register',
    hasDigitalGap: false,
    icpGrade: 'A',
    winProbability: 75,
    riskSummary: 'High dependency on single-region cloud infrastructure and manual reporting workflows.',
    oppSummary: 'Recently hired a new Finance Director and posted requirements for financial automation and ERP integration.',
    meddpicc: {
      metrics: true,
      economicBuyer: true,
      decisionCriteria: true,
      decisionProcess: false,
      paperProcess: false,
      identifyPain: true,
      champion: true,
      competition: true
    },
    committee: [
      { name: 'Sarah Jenkins', role: 'Economic Buyer', title: 'VP of Finance', influence: 'High', status: 'Engaged' },
      { name: 'Dave Miller', role: 'Champion', title: 'Accounting Systems Mgr', influence: 'High', status: 'Engaged' },
      { name: 'Alex Wong', role: 'User', title: 'Senior Auditor', influence: 'Medium', status: 'Contacted' },
      { name: 'Karen Vance', role: 'Blocker', title: 'IT Security Lead', influence: 'Negative', status: 'Blocked' }
    ],
    signals: [
      { id: 's1', type: 'Government Tender Match', source: 'AusTender', timestamp: '2026-06-27T08:30:00Z', weight: 35, description: 'Matched tender for ERP Consolidation & Reporting Automation', evidence: 'Tender ID: RFT-2026-98124.' },
      { id: 's2', type: 'Funding Announcement', source: 'Crunchbase', timestamp: '2026-06-25T14:00:00Z', weight: 28, description: 'Raised $15M Series B from Blackbird Ventures', evidence: 'Earmarked for scaling accounting infrastructure.' },
      { id: 's3', type: 'Search Intent Spike', source: 'Google Trends API', timestamp: '2026-06-27T12:00:00Z', weight: 25, description: 'Spike in searches for "multi-entity financial ERP migration"', evidence: '+180% search surge in Melbourne/Sydney area.', searchIntentKeyword: 'multi-entity financial ERP migration' }
    ],
    techStack: [
      { category: 'Accounting', name: 'Xero', confidence: 98 },
      { category: 'CRM', name: 'HubSpot', confidence: 95 },
      { category: 'Hosting', name: 'AWS', confidence: 100 }
    ],
    jobs: [],
    webDiffs: []
  },
  {
    id: 'smb-1',
    name: 'Brisbane Pro Electrical Services',
    domain: 'brisbaneproelectrical.com.au',
    industry: 'Trades & Construction',
    revenue: '$800K - $1.2M',
    headcount: 6,
    intentScore: 88,
    classification: 'Immediate Opportunity',
    targetTier: 'SMB',
    country: 'Australia',
    registrySource: 'Australian Business Register (ABR)',
    hasDigitalGap: true,
    icpGrade: 'A',
    winProbability: 55,
    riskSummary: 'No online quoting engine or customer booking portal; relies on manual phone dispatch.',
    oppSummary: 'Registered ABN 2 months ago; high-intent opportunity to deploy job scheduling and local SEO.',
    meddpicc: {
      metrics: false,
      economicBuyer: true,
      decisionCriteria: false,
      decisionProcess: false,
      paperProcess: false,
      identifyPain: true,
      champion: true,
      competition: false
    },
    committee: [
      { name: 'John Doe', role: 'Economic Buyer', title: 'Founder & Owner', influence: 'High', status: 'Engaged' }
    ],
    signals: [
      { id: 'smb-s1', type: 'New Business Registration (< 6 months)', source: 'ABR API', timestamp: '2026-06-24T09:00:00Z', weight: 20, description: 'Registered new ABN entity in Queensland', evidence: 'Entity age: 45 days.' },
      { id: 'smb-s2', type: 'Hyper-Local Buying Intent Phrase', source: 'Facebook Groups (Brisbane Trades)', timestamp: '2026-06-27T15:20:00Z', weight: 18, description: 'Owner post: "Looking for a good job scheduling software or admin assistant..."', evidence: 'Posted by John Doe (Owner).' }
    ],
    techStack: [
      { category: 'Invoicing', name: 'Xero', confidence: 85 }
    ],
    jobs: [],
    webDiffs: []
  },
  {
    id: '2',
    name: 'DevFlow Operations',
    domain: 'devflow.com.au',
    industry: 'Software Engineering',
    revenue: '$12M - $15M',
    headcount: 58,
    intentScore: 42,
    classification: 'Warm',
    targetTier: 'Enterprise',
    country: 'Australia',
    registrySource: 'ASIC Company Register',
    hasDigitalGap: false,
    icpGrade: 'B',
    winProbability: 30,
    riskSummary: 'Potential customer churn due to outdated security certifications.',
    oppSummary: 'Actively migrating infrastructure to multi-cloud. Seeking SRE and DevOps support.',
    meddpicc: {
      metrics: false,
      economicBuyer: false,
      decisionCriteria: true,
      decisionProcess: false,
      paperProcess: false,
      identifyPain: true,
      champion: false,
      competition: false
    },
    committee: [
      { name: 'Marcus Sterling', role: 'User', title: 'Tech Lead SRE', influence: 'Medium', status: 'Contacted' }
    ],
    signals: [
      { id: 's6', type: 'Active Hiring', source: 'LinkedIn Jobs', timestamp: '2026-06-27T11:45:00Z', weight: 20, description: 'Hiring: Lead DevOps Engineer & Cloud Architect', evidence: 'Spearheading cloud migration.' },
      { id: 's7', type: 'Technology Migration Signal', source: 'Tech Detector', timestamp: '2026-06-26T16:20:00Z', weight: 22, description: 'Detected migration of DNS and hosting tags', evidence: 'NS updated to AWS Route 53.' }
    ],
    techStack: [
      { category: 'CI/CD', name: 'Azure DevOps', confidence: 99 }
    ],
    jobs: [],
    webDiffs: []
  }
];

export const mockSearchTrends: SearchIntentTrend[] = [
  { keyword: 'AI bookkeeping software for tradies', category: 'Accounting / SMB', growthPercentage: 240, region: 'Australia (East Coast)', monthlyVolume: 18400 },
  { keyword: 'Cloud ERP migration for manufacturing', category: 'Enterprise Technology', growthPercentage: 180, region: 'Germany / EU', monthlyVolume: 9200 }
];

export const mockAgents: AgentStatus[] = [
  { id: 1, name: 'Company Discovery', tier: 'Enterprise', responsibilities: 'Monitor registers; detect new registrations.', outputType: 'Company Profile Object', status: 'success', lastRun: '2026-06-28T01:30:00Z', logCount: 142 },
  { id: 2, name: 'Website Monitor', tier: 'Enterprise', responsibilities: 'Diff HTML snapshots; detect changes.', outputType: 'Website Change Report', status: 'success', lastRun: '2026-06-28T01:38:00Z', logCount: 521 },
  { id: 3, name: 'Job Intelligence', tier: 'Enterprise', responsibilities: 'Scrape Seek; parse requirements.', outputType: 'Hiring Intent Signal', status: 'success', lastRun: '2026-06-28T01:15:00Z', logCount: 890 },
  { id: 4, name: 'Funding & News', tier: 'Enterprise', responsibilities: 'Track rounds and executive shifts.', outputType: 'Opportunity Score', status: 'idle', lastRun: '2026-06-27T23:00:00Z', logCount: 84 },
  { id: 5, name: 'Tender Intelligence', tier: 'Enterprise', responsibilities: 'Ingest AusTender; match service profiles.', outputType: 'Tender Match Report', status: 'success', lastRun: '2026-06-28T01:25:00Z', logCount: 12 },
  { id: 6, name: 'Public Conversation', tier: 'Enterprise', responsibilities: 'Monitor forums for intent phrases.', outputType: 'Conversation Intent Signal', status: 'success', lastRun: '2026-06-28T01:37:45Z', logCount: 2011 },
  { id: 7, name: 'Review Intelligence', tier: 'Enterprise', responsibilities: 'Alert on competitor dissatisfaction.', outputType: 'Churn Opportunity Signal', status: 'idle', lastRun: '2026-06-28T00:00:00Z', logCount: 195 },
  { id: 8, name: 'Tech Detection', tier: 'Enterprise', responsibilities: 'Fingerprint public-facing tech stacks.', outputType: 'Tech Stack Profile', status: 'success', lastRun: '2026-06-28T01:05:00Z', logCount: 1205 },
  { id: 9, name: 'Company Research', tier: 'Enterprise', responsibilities: 'Synthesize opportunity summary cards.', outputType: 'Company Intelligence Card', status: 'success', lastRun: '2026-06-28T01:32:00Z', logCount: 312 },
  { id: 10, name: 'Intent Scoring', tier: 'Enterprise', responsibilities: 'Calculate weighted composite intent scores.', outputType: 'Scored Lead Object', status: 'success', lastRun: '2026-06-28T01:33:00Z', logCount: 450 },
  { id: 11, name: 'Proposal Generator', tier: 'Enterprise', responsibilities: 'Draft outreach templates with signal citations.', outputType: 'Outreach Package', status: 'idle', lastRun: '2026-06-28T01:00:00Z', logCount: 115 },
  { id: 12, name: 'Meeting Prep', tier: 'Enterprise', responsibilities: 'Assemble pre-meeting briefing documents.', outputType: 'Meeting Brief Document', status: 'idle', lastRun: '2026-06-28T01:10:00Z', logCount: 42 },
  { id: 13, name: 'Analytics & Reporting', tier: 'Enterprise', responsibilities: 'Dashboard signals and attribution metrics.', outputType: 'Analytics Dashboard', status: 'success', lastRun: '2026-06-28T01:35:00Z', logCount: 93 },
  { id: 14, name: 'SMB Discovery Agent', tier: 'SMB/Local', responsibilities: 'Monitor registers & GBP for brand new listings.', outputType: 'SMB Lead Object', status: 'success', lastRun: '2026-06-28T01:50:00Z', logCount: 3410 },
  { id: 15, name: 'Hyper-Local Intent Agent', tier: 'SMB/Local', responsibilities: 'Scrape Nextdoor & community boards for local queries.', outputType: 'Local Intent Signal', status: 'success', lastRun: '2026-06-28T01:55:00Z', logCount: 4120 },
  
  // Agent 16 Deal Intelligence - NEW IN V3.1
  { id: 16, name: 'Deal Qualification Engine', tier: 'Deal Intelligence', responsibilities: 'Map buying committees and calculate win probabilities using MEDDPICC.', outputType: 'Win Probability Object', status: 'success', lastRun: '2026-06-28T02:00:00Z', logCount: 180 }
];

export const mockLogs: LogEntry[] = [
  { timestamp: '02:00:00', agentId: 16, type: 'success', message: 'Audited Apex Finance Systems win probability: 75% (Economic Buyer & Champion engaged)' },
  { timestamp: '01:59:45', agentId: 16, type: 'info', message: 'Mapping stakeholder committee for DevFlow Operations (SRE Lead contacted)' },
  { timestamp: '01:55:12', agentId: 15, type: 'success', message: 'Extracted hyper-local intent signal from Facebook Group for Brisbane Pro Electrical' }
];
