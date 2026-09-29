export type ResearchMode =
  | "general"
  | "find_case"
  | "research_issue"
  | "analyse_matter"
  | "similar_cases"
  | "research_legislation"
  | "compare_cases"
  | "check_authority"
  | "case_summary"
  | "build_arguments"
  | "draft_memo"
  | "document_analysis";

export type AudienceMode = "lawyer" | "public";

export interface LegalSource {
  title: string;
  uri: string;
  isSaflii: boolean;
}

export interface SafliiCaseAuthority {
  caseName: string;
  citation: string;
  neutralCitation?: string;
  court: string;
  courtCode?: string;
  year: number;
  hierarchyWeight?: string;
  legalArea?: string;
  legalPrinciples?: string;
  relevanceSummary?: string;
  safliiUrl: string;
}

export interface ResearchResult {
  id: string;
  query: string;
  mode: ResearchMode;
  audienceMode: AudienceMode;
  content: string;
  sources: LegalSource[];
  directSafliiSearchUrl?: string;
  timestamp: string;
  extractedTerms?: string[];
  matterTitle?: string;
  authorities?: SafliiCaseAuthority[];
  isServiceBusy?: boolean;
  busyMessage?: string;
  searchTerms?: string[];
  legalConcepts?: string[];
}

export interface LegalMatter {
  id: string;
  title: string;
  clientRef?: string;
  jurisdiction: string;
  areaOfLaw: string;
  facts: string;
  issuesIdentified: string[];
  keyAuthorities: string[];
  outstandingResearch: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PresetAction {
  id: string;
  label: string;
  prompt: string;
  mode: ResearchMode;
  icon?: string;
}
