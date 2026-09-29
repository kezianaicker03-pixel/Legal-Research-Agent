import { ResearchMode } from "../types";

export interface ModeOption {
  id: ResearchMode;
  title: string;
  shortDesc: string;
  iconName: string;
  badge?: string;
  promptPlaceholder: string;
  defaultPrompt?: string;
}

export const RESEARCH_MODES: ModeOption[] = [
  {
    id: "find_case",
    title: "Find a Case",
    shortDesc: "Search South African cases using facts, legal principles, keywords, or subject matter.",
    iconName: "Search",
    promptPlaceholder: "e.g. Find cases where an employee was dismissed because of WhatsApp messages...",
    defaultPrompt: "Find leading South African cases where an employee was dismissed for sending defamatory or insulting messages on a company WhatsApp group.",
  },
  {
    id: "research_issue",
    title: "Research a Legal Issue",
    shortDesc: "Research legislation, judgments and legal principles relating to a particular legal question.",
    iconName: "Scale",
    promptPlaceholder: "e.g. What is the test for an urgent interdict in the High Court?",
    defaultPrompt: "What is the authoritative test for an urgent interim interdict under South African common law and Rule 6(12)?",
  },
  {
    id: "analyse_matter",
    title: "Analyse My Matter",
    shortDesc: "Describe client facts to identify legal issues, authorities, arguments and litigation risks (IRAC).",
    iconName: "Briefcase",
    promptPlaceholder: "Describe your client's factual background...",
    defaultPrompt: "My client entered into a commercial lease agreement. The landlord locked the premises and seized client equipment without a court order for alleged rental arrears. Analyse the legal remedies including spoliation.",
  },
  {
    id: "similar_cases",
    title: "Find Similar Cases",
    shortDesc: "Search for cases on SAFLII involving facts analogous to those supplied.",
    iconName: "GitCompare",
    promptPlaceholder: "e.g. Cases where a director withdrew company funds for personal expenses...",
    defaultPrompt: "Find cases with similar facts: a co-director withdrew substantial sums from the company bank account without board resolution or consent of other shareholders.",
  },
  {
    id: "research_legislation",
    title: "Research Legislation",
    shortDesc: "Identify relevant Acts, sections, amendments and judicial interpretations.",
    iconName: "BookOpen",
    promptPlaceholder: "e.g. Section 162 of the Companies Act 71 of 2008 (delinquent directors)...",
    defaultPrompt: "Explain Section 162 of the Companies Act 71 of 2008 regarding declaring a director delinquent, citing leading SCA and High Court judgments.",
  },
  {
    id: "compare_cases",
    title: "Compare Cases",
    shortDesc: "Compare two or more judgments, their facts, ratio decidendi, and court hierarchy.",
    iconName: "Columns2",
    promptPlaceholder: "e.g. Compare Barkhuizen v Napier with Beadica 231 CC regarding public policy and contractual enforcement...",
    defaultPrompt: "Compare Barkhuizen v Napier 2007 (5) SA 323 (CC) with Beadica 231 CC v Trustees, Oregon Trust 2020 (5) SA 247 (CC) regarding public policy, fairness and enforcement of contract terms.",
  },
  {
    id: "check_authority",
    title: "Check Case Authority",
    shortDesc: "Investigate whether a judgment was followed, distinguished, criticised, or overturned.",
    iconName: "CheckCircle2",
    promptPlaceholder: "e.g. Check authority for Plascon-Evans Paints Ltd v Van Riebeeck Paints...",
    defaultPrompt: "Check subsequent judicial treatment and current authority of Plascon-Evans Paints Ltd v Van Riebeeck Paints (Pty) Ltd 1984 (3) SA 623 (A) regarding factual disputes on motion proceedings.",
  },
  {
    id: "case_summary",
    title: "Summarise a Judgment",
    shortDesc: "Enter case name, citation or SAFLII link for a structured factual and legal summary.",
    iconName: "FileText",
    promptPlaceholder: "e.g. Enter case name, citation or SAFLII link (e.g. [2021] ZACC 18)...",
    defaultPrompt: "Provide a structured case summary for Natal Joint Municipal Pension Fund v Endumeni Municipality [2012] ZASCA 13 regarding the modern South African approach to statutory interpretation.",
  },
  {
    id: "build_arguments",
    title: "Build Legal Arguments",
    shortDesc: "Develop arguments for each legally plausible side using verified authorities.",
    iconName: "Swords",
    promptPlaceholder: "e.g. Arguments for applicant seeking eviction vs respondent alleging PIE Act protections...",
    defaultPrompt: "Build legal arguments for both applicant and respondent in an eviction application where an occupier claims tacit renewal of lease and protections under the PIE Act 19 of 1998.",
  },
  {
    id: "draft_memo",
    title: "Create Legal Research Memo",
    shortDesc: "Generate a formal professional legal research memorandum with citations and IRAC analysis.",
    iconName: "FileCheck",
    promptPlaceholder: "e.g. Legal memorandum on liability of municipality for pothole damages...",
    defaultPrompt: "Draft a formal legal research memorandum on the delictual liability of a municipality for vehicle damages caused by unmaintained potholes on a public road.",
  },
];

export const SMART_SEARCH_EXAMPLES = [
  "Find cases where an employee was dismissed because of WhatsApp messages.",
  "What cases deal with unfair contract terms and public policy?",
  "Find Constitutional Court cases on procurement irregularities and legality review.",
  "My client's business partner withdrew money without permission. What cases could apply?",
  "What is the test for an urgent interdict?",
  "Find judgments where directors were held personally liable under Section 218(2).",
  "Mandament van spolie requirements and whether access to electricity is protected.",
  "Requirements for piercing the corporate veil under Section 20(9) of the Companies Act.",
];

export const COURT_HIERARCHY_DATA = [
  {
    code: "ZACC",
    court: "Constitutional Court of South Africa",
    seat: "Constitution Hill, Braamfontein, Johannesburg",
    status: "Apex Court (Highest in all constitutional & public importance matters)",
    weight: "Strictly Binding on all other courts in South Africa",
    safliiDatabase: "https://www.saflii.org/za/cases/ZACC/",
  },
  {
    code: "ZASCA",
    court: "Supreme Court of Appeal",
    seat: "Bloemfontein, Free State",
    status: "Highest Court of Appeal in non-constitutional matters, subordinate only to ZACC",
    weight: "Strictly Binding on all High Courts and Lower Courts",
    safliiDatabase: "https://www.saflii.org/za/cases/ZASCA/",
  },
  {
    code: "High Courts",
    court: "High Court of South Africa (Provincial & Local Divisions)",
    seat: "Pretoria (GPPHC), Johannesburg (GJHC), Cape Town (WCHC), Durban/Pietermaritzburg (KZDHC), etc.",
    status: "Superior Court of first instance & provincial appeal",
    weight: "Binding on subordinate courts in its province; persuasive on other High Court divisions",
    safliiDatabase: "https://www.saflii.org/za/cases/ZAGPPHC/",
  },
  {
    code: "ZALAC / ZALC",
    court: "Labour Appeal Court & Labour Court",
    seat: "Johannesburg, Cape Town, Durban, Gqeberha",
    status: "Specialist jurisdiction under Labour Relations Act 66 of 1995",
    weight: "ZALAC binding on Labour Court and CCMA; subject to ZACC/ZASCA",
    safliiDatabase: "https://www.saflii.org/za/cases/ZALAC/",
  },
  {
    code: "Specialist",
    court: "Competition Appeal Court, Land Court, Electoral Court, Tax Courts",
    seat: "Various specialist seats across South Africa",
    status: "Specialist statutory tribunals and superior courts",
    weight: "Binding on respective subject matter, subject to SCA and CC",
    safliiDatabase: "https://www.saflii.org/",
  },
];
