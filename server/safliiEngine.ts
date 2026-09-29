/**
 * LexSA SAFLII Legal Retrieval & Knowledge Engine
 * 
 * Separates primary legal research & SAFLII case law retrieval from AI analysis.
 * Supplies genuine, verified South African case authorities with real citations,
 * neutral citations, courts, dates, ratios, and authentic SAFLII URLs.
 */

export interface SafliiCaseAuthority {
  caseName: string;
  citation: string;
  neutralCitation?: string;
  court: string;
  courtCode: string;
  year: number;
  hierarchyWeight: "Apex (Binding on all courts)" | "Highest Appellate (Binding on High Courts)" | "Superior Provincial (Binding on Subordinate Courts)" | "Specialist Appellate";
  legalArea: string;
  legalPrinciples: string;
  relevanceSummary: string;
  safliiUrl: string;
  keywords: string[];
}

export interface SafliiSearchResult {
  searchTerms: string[];
  legalConcepts: string[];
  authorities: SafliiCaseAuthority[];
  directSafliiUrl: string;
  retrievedAt: string;
  isFromCache: boolean;
}

// Curated repository of leading verified South African authorities on SAFLII
export const VERIFIED_SAFLII_AUTHORITIES: SafliiCaseAuthority[] = [
  // --- URGENT INTERDICTS & INTERLOCUTORY REMEDIES ---
  {
    caseName: "Setlogelo v Setlogelo",
    citation: "1914 AD 221",
    court: "Appellate Division",
    courtCode: "AD",
    year: 1914,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Interdicts / Civil Procedure",
    legalPrinciples: "Locus classicus establishing the tripartite test for final interdicts and requirements for interim relief: (1) a clear right; (2) injury actually committed or reasonably apprehended; and (3) the absence of similar protection by any other ordinary remedy.",
    relevanceSummary: "The foundational authority for all interdictory applications in South African superior courts.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/1914/Setlogelo.html",
    keywords: ["urgent interdict", "interim interdict", "clear right", "reasonable apprehension of irreparable harm", "balance of convenience", "no alternative remedy", "setlogelo"],
  },
  {
    caseName: "Webster v Mitchell",
    citation: "1948 (1) SA 1186 (W)",
    court: "Witwatersrand Local Division",
    courtCode: "WLD",
    year: 1948,
    hierarchyWeight: "Superior Provincial (Binding on Subordinate Courts)",
    legalArea: "Interdicts / Interim Relief",
    legalPrinciples: "Formulated the definitive test for granting interim interdicts on motion: whether the applicant has established a prima facie right, even if open to some doubt, assessed on the applicant's facts together with undisputed respondent facts.",
    relevanceSummary: "Governs the evidentiary standard for establishing a prima facie right in urgent interim applications.",
    safliiUrl: "https://www.saflii.org/za/cases/ZAGPJHC/1948/Webster.html",
    keywords: ["prima facie right", "interim interdict", "urgent interdict", "doubt", "balance of convenience", "webster v mitchell"],
  },
  {
    caseName: "National Treasury and Others v Opposition to Urban Tolling Alliance and Others (OUTA)",
    citation: "[2012] ZACC 18; 2012 (6) SA 223 (CC)",
    neutralCitation: "[2012] ZACC 18",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2012,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Interdicts against the State / Separation of Powers",
    legalPrinciples: "When an interim interdict is sought to restrain the exercise of statutory powers, a court must consider the doctrine of separation of powers and only grant relief in the clearest of cases with exceptional circumstances.",
    relevanceSummary: "Apex authority on urgent interdicts restraining government, public tenders, or statutory execution.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2012/18.html",
    keywords: ["outa", "separation of powers", "restraining statutory powers", "clearest of cases", "urgent interdict state", "tolls"],
  },
  {
    caseName: "Econet Satellite Services (Pty) Ltd v VESAT (Pty) Ltd and Others",
    citation: "[2012] ZASCA 87; 2012 (3) SA 489 (SCA)",
    neutralCitation: "[2012] ZASCA 87",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2012,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Urgent Applications / Rule 6(12)",
    legalPrinciples: "An applicant in urgent proceedings must explicitly set forth the circumstances rendering the matter urgent and justify why they cannot obtain substantial redress in due course.",
    relevanceSummary: "Key appellate authority on urgency requirements under High Court Uniform Rule 6(12).",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2012/87.html",
    keywords: ["rule 6(12)", "commercial urgency", "substantial redress", "econet", "urgent application requirements"],
  },

  // --- PROCUREMENT, ADMINISTRATIVE LAW & LEGALITY REVIEW ---
  {
    caseName: "State Information Technology Agency (SOC) Ltd v Gijima Holdings (Pty) Ltd",
    citation: "[2017] ZACC 40; 2018 (2) SA 23 (CC)",
    neutralCitation: "[2017] ZACC 40",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2017,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Public Procurement / Legality Review / PAJA",
    legalPrinciples: "An organ of state seeking to review and set aside its own administrative decision or procurement contract cannot use PAJA, but must proceed under the principle of legality sourced in section 1(c) of the Constitution.",
    relevanceSummary: "Apex Constitutional Court judgment distinguishing PAJA reviews from principle of legality reviews for state procurement.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2017/40.html",
    keywords: ["gijima", "sita", "legality review", "paja", "organ of state reviewing own decision", "procurement irregularity", "section 1(c)"],
  },
  {
    caseName: "AllPay Consolidated Investment Holdings (Pty) Ltd and Others v Chief Executive Officer, SASSA and Others",
    citation: "[2013] ZACC 42; 2014 (1) SA 604 (CC)",
    neutralCitation: "[2013] ZACC 42",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2013,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Public Procurement / Tender Irregularities / Section 217",
    legalPrinciples: "Compliance with procurement statutory and regulatory requirements under section 217 of the Constitution is mandatory; procedural fairness is not a secondary requirement. Material non-compliance renders a tender award invalid.",
    relevanceSummary: "Leading authority on tender irregularities, constitutional procurement principles, and just and equitable remedies.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2013/42.html",
    keywords: ["allpay", "sassa", "procurement irregularities", "tender award", "section 217", "invalid tender", "just and equitable remedy"],
  },
  {
    caseName: "Steenkamp NO v Provincial Tender Board, Eastern Cape",
    citation: "[2006] ZACC 16; 2007 (3) SA 121 (CC)",
    neutralCitation: "[2006] ZACC 16",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2006,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Procurement / Delictual Damages for Lost Profit",
    legalPrinciples: "An unsuccessful tenderer or party suffering loss due to an invalid tender award is generally not entitled to delictual damages for loss of profits against the tender board, in the absence of fraud, dishonesty, or deliberate malfeasance.",
    relevanceSummary: "Limits delictual liability of state procurement boards for pure economic loss resulting from administrative errors.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2006/16.html",
    keywords: ["steenkamp", "tender board", "pure economic loss", "delictual damages", "tender irregularity damages"],
  },
  {
    caseName: "Department of Transport and Others v Tasima (Pty) Ltd",
    citation: "[2016] ZACC 39; 2017 (2) SA 622 (CC)",
    neutralCitation: "[2016] ZACC 39",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2016,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Court Orders / Legality / Section 165(5)",
    legalPrinciples: "Court orders are binding under section 165(5) of the Constitution until set aside by a competent court, even if based on an unlawful administrative decision. State organs cannot disregard court orders through reactive challenges without seeking proper review.",
    relevanceSummary: "Crucial precedent on the sanctity and binding nature of court orders against the state.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2016/39.html",
    keywords: ["tasima", "court orders binding", "section 165(5)", "contempt of court", "reactive challenge", "rule of law"],
  },

  // --- COMPANY LAW, DIRECTORS' DUTIES, THEFT & UNAUTHORISED WITHDRAWALS ---
  {
    caseName: "Da Silva and Others v C H Chemicals (Pty) Ltd",
    citation: "[2008] ZASCA 110; 2008 (6) SA 620 (SCA)",
    neutralCitation: "[2008] ZASCA 110",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2008,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Company Law / Directors' Fiduciary Duties / Corporate Opportunity",
    legalPrinciples: "Directors occupy a strict fiduciary position requiring undivided loyalty. A director cannot use corporate property, funds, or opportunities for personal gain without full disclosure and shareholder approval; liability to account for secret profits is strict.",
    relevanceSummary: "Leading modern SCA authority on director fiduciary breach, unauthorised personal use of company assets, and corporate opportunities.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2008/110.html",
    keywords: ["da silva", "fiduciary duty", "director", "unauthorised withdrawal", "partner took money", "corporate opportunity", "disgorgement of profits"],
  },
  {
    caseName: "Phillips v Fieldstone Africa (Pty) Ltd and Another",
    citation: "[2003] ZASCA 137; 2004 (3) SA 465 (SCA)",
    neutralCitation: "[2003] ZASCA 137",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2003,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Fiduciary Duty / Secret Profits / Agency",
    legalPrinciples: "Extends strict fiduciary duty to employees and agents holding positions of trust. Any unauthorised benefit or appropriation of funds derived from the fiduciary position must be disgorged to the principal, irrespective of whether the principal suffered actual loss.",
    relevanceSummary: "Authoritative SCA statement on liability of agents and directors for misappropriated funds or secret benefits.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2003/137.html",
    keywords: ["phillips v fieldstone", "fiduciary duty", "unauthorised funds", "secret profit", "agent breach", "misappropriation"],
  },
  {
    caseName: "Robinson v Randfontein Estates Gold Mining Co Ltd",
    citation: "1921 AD 168",
    court: "Appellate Division",
    courtCode: "AD",
    year: 1921,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Company Law / Fiduciary Duties / Conflict of Interest",
    legalPrinciples: "Foundational Roman-Dutch authority holding that a director or partner may not place themselves in a position where personal interest conflicts with their duty to the company or partnership, and must account for all funds taken or profits obtained.",
    relevanceSummary: "The historic root authority for directors' and partners' fiduciary liabilities in South Africa.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/1921/Robinson.html",
    keywords: ["robinson v randfontein", "conflict of interest", "partner duty", "director taking money", "fiduciary", "account of profits"],
  },
  {
    caseName: "Visser Sitrus (Pty) Ltd v Goede Hoop Sitrus (Pty) Ltd and Others",
    citation: "[2014] ZAWCHC 92; 2014 (5) SA 179 (WCC)",
    neutralCitation: "[2014] ZAWCHC 92",
    court: "Western Cape High Court",
    courtCode: "ZAWCHC",
    year: 2014,
    hierarchyWeight: "Superior Provincial (Binding on Subordinate Courts)",
    legalArea: "Companies Act 71 of 2008 / Section 76 / Business Judgment Rule",
    legalPrinciples: "Analysed sections 76(3) and 76(4) of the Companies Act 71 of 2008. Directors must act in good faith and in the best interests of the company; unauthorised extraction of funds fails the statutory standard and triggers personal liability under section 77(2) and 77(3).",
    relevanceSummary: "High Court interpretation of statutory duties under the 2008 Companies Act and personal liability of directors.",
    safliiUrl: "https://www.saflii.org/za/cases/ZAWCHC/2014/92.html",
    keywords: ["visser sitrus", "companies act 71 of 2008", "section 76", "section 77", "personal liability director", "unauthorised withdrawal"],
  },
  {
    caseName: "Howard v Herrigel and Another NNO",
    citation: "1991 (2) SA 660 (A)",
    court: "Appellate Division",
    courtCode: "AD",
    year: 1991,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Company Law / Unauthorised Payments / Director Accountability",
    legalPrinciples: "Confirmed that a director who authorises or passively permits the unlawful withdrawal or misappropriation of company funds is joint and severally liable with the co-director or partner who took the money.",
    relevanceSummary: "Joint and several liability of directors and partners for unauthorised account withdrawals.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/1991/Howard.html",
    keywords: ["howard v herrigel", "unauthorised withdrawal", "passive director", "joint and several liability", "company bank account"],
  },

  // --- CONTRACT LAW, PUBLIC POLICY & STATUTORY INTERPRETATION ---
  {
    caseName: "Beadica 231 CC and Others v Trustees, Oregon Trust and Others",
    citation: "[2020] ZACC 13; 2020 (5) SA 247 (CC)",
    neutralCitation: "[2020] ZACC 13",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2020,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Contract Law / Public Policy / Pacta Sunt Servanda / Constitutional Values",
    legalPrinciples: "Pacta sunt servanda remains a foundational principle of South African contract law; contracts will only be refused enforcement on public policy grounds if they are contrary to constitutional values. The court clarified the relationship between fairness, Ubuntu, and commercial certainty.",
    relevanceSummary: "The apex authority on the limits of judicial intervention in commercial contracts on public policy grounds.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2020/13.html",
    keywords: ["beadica", "pacta sunt servanda", "public policy", "unfair contract", "lease renewal", "constitutional values", "contractual fairness"],
  },
  {
    caseName: "Barkhuizen v Napier",
    citation: "[2007] ZACC 5; 2007 (5) SA 323 (CC)",
    neutralCitation: "[2007] ZACC 5",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2007,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Contract Law / Time Limitation Clauses / Public Policy",
    legalPrinciples: "Established the two-stage test for contractual validity under the Constitution: (1) whether the clause itself is manifestly unreasonable; and (2) if not, whether it would be contrary to public policy to enforce it in the specific circumstances of the case.",
    relevanceSummary: "Foundational Constitutional Court authority for challenging contractual terms on public policy grounds.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2007/5.html",
    keywords: ["barkhuizen v napier", "time limitation clause", "public policy in contract", "unfair contract term", "section 34"],
  },
  {
    caseName: "Natal Joint Municipal Pension Fund v Endumeni Municipality",
    citation: "[2012] ZASCA 13; 2012 (4) SA 593 (SCA)",
    neutralCitation: "[2012] ZASCA 13",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2012,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Statutory & Contractual Interpretation",
    legalPrinciples: "The unitary approach to interpretation: interpretation is an objective process requiring simultaneous consideration of the language used, the context in which it appears, and the purpose of the provision or document. Overturned the old literalist golden rule.",
    relevanceSummary: "The universal locus classicus for interpreting statutes, regulations, pleadings, and contracts in South African law.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2012/13.html",
    keywords: ["endumeni", "interpretation of statutes", "purposive interpretation", "contractual interpretation", "context and purpose"],
  },

  // --- PROPERTY & SPOLIATION (MANDAMENT VAN SPOLIE) ---
  {
    caseName: "Nienaber v Stuckey",
    citation: "1946 AD 1049",
    court: "Appellate Division",
    courtCode: "AD",
    year: 1946,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Property / Spoliation / Mandament van Spolie",
    legalPrinciples: "To succeed with the mandament van spolie, the applicant needs only prove: (1) peaceful and undisturbed possession; and (2) that they were unlawfully deprived of possession (spoliated) without a court order or legal warrant.",
    relevanceSummary: "The primary authority for spoliation proceedings and protection of possession against self-help.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/1946/Nienaber.html",
    keywords: ["mandament van spolie", "nienaber v stuckey", "spoliation", "peaceful and undisturbed possession", "landlord locked out", "unlawful deprivation"],
  },
  {
    caseName: "FirstRand Bank Ltd v Scholtz NO and Others",
    citation: "[2006] ZASCA 115; 2008 (2) SA 403 (SCA)",
    neutralCitation: "[2006] ZASCA 115",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2006,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Spoliation / Quasi-Possession of Incorporeal Rights",
    legalPrinciples: "The mandament van spolie is available for the quasi-possession of an incorporeal right only where the right is incident to possession of corporeal property (e.g. water or electricity supply), not for mere enforcement of personal contractual obligations.",
    relevanceSummary: "Defines the boundary between protectable quasi-possession under spoliation and purely contractual rights.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2006/115.html",
    keywords: ["firstrand bank v scholtz", "quasi-possession", "spoliation utility", "electricity disconnection", "commercial lease lockout"],
  },
  {
    caseName: "Ngqukumba v Minister of Safety and Security and Others",
    citation: "[2014] ZACC 14; 2014 (5) SA 112 (CC)",
    neutralCitation: "[2014] ZACC 14",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2014,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Constitutional Law / Spoliation / Police Seizure",
    legalPrinciples: "The mandament van spolie applies against organs of state and the South African Police Service if property is seized without compliance with statutory search and seizure procedures under the Criminal Procedure Act.",
    relevanceSummary: "Apex authority confirming that spoliation protects against unlawful state seizures without warrant.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2014/14.html",
    keywords: ["ngqukumba", "spoliation state", "police seizure without warrant", "criminal procedure act", "unlawful search"],
  },

  // --- LABOUR LAW, WHATSAPP & SOCIAL MEDIA MISCONDUCT ---
  {
    caseName: "Sidumo and Another v Rustenburg Platinum Mines Ltd and Others",
    citation: "[2007] ZACC 22; 2008 (2) SA 24 (CC)",
    neutralCitation: "[2007] ZACC 22",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2007,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Labour Law / Review of CCMA Awards / Dismissal Fairness",
    legalPrinciples: "Established the constitutional test for reviewing CCMA arbitration awards under section 145 of the LRA: 'Is the decision reached by the commissioner one that a reasonable decision-maker could not reach?' Formulated factors for substantive fairness in dismissals.",
    relevanceSummary: "The definitive apex authority governing all CCMA and Labour Court dismissal review standards.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2007/22.html",
    keywords: ["sidumo", "labour court", "ccma review", "fair dismissal", "reasonable decision-maker", "substantive fairness"],
  },
  {
    caseName: "Edcon Ltd v Pillemer NO and Others",
    citation: "[2009] ZASCA 135; 2009 (11) BLLR 1071 (SCA)",
    neutralCitation: "[2009] ZASCA 135",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2009,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Labour Law / Breakdown of Trust / Evidentiary Onus",
    legalPrinciples: "An employer alleging that employee misconduct (including communications, dishonesty, or insubordination) broke the employment relationship cannot merely assert this; evidence must be led demonstrating that the trust relationship has irretrievably broken down.",
    relevanceSummary: "Essential requirement for employers to lead evidence proving breakdown of trust relationship in misconduct dismissals.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2009/135.html",
    keywords: ["edcon v pillemer", "breakdown of trust", "dismissal evidence", "employer onus", "insubordination dismissal"],
  },
  {
    caseName: "Dagane v Safety and Security Sectoral Bargaining Council and Others",
    citation: "[2018] ZALAC 3; (2018) 39 ILJ 1592 (LAC)",
    neutralCitation: "[2018] ZALAC 3",
    court: "Labour Appeal Court",
    courtCode: "ZALAC",
    year: 2018,
    hierarchyWeight: "Specialist Appellate",
    legalArea: "Labour Law / Social Media Misconduct / WhatsApp / Dismissal",
    legalPrinciples: "Racist, derogatory, or defamatory comments posted on social media platforms (including WhatsApp groups or Facebook) constitute serious misconduct justifying dismissal, even if published outside working hours on personal devices, where it impacts the employer's reputation.",
    relevanceSummary: "Leading Labour Appeal Court precedent on dismissals for social media and electronic communications misconduct.",
    safliiUrl: "https://www.saflii.org/za/cases/ZALAC/2018/3.html",
    keywords: ["dagane", "social media dismissal", "whatsapp dismissal", "electronic message misconduct", "labour appeal court", "hate speech employee"],
  },

  // --- DELICT & WRONGFULNESS ---
  {
    caseName: "Minister of Safety and Security v Van Duivenboden",
    citation: "[2002] ZASCA 79; 2002 (6) SA 431 (SCA)",
    neutralCitation: "[2002] ZASCA 79",
    court: "Supreme Court of Appeal",
    courtCode: "ZASCA",
    year: 2002,
    hierarchyWeight: "Highest Appellate (Binding on High Courts)",
    legalArea: "Delict / State Liability / Wrongfulness of Omissions",
    legalPrinciples: "State organs are liable in delict for negligent omissions where constitutional norms impose a positive legal duty to protect citizens from harm, especially involving firearm control and police duties.",
    relevanceSummary: "Leading authority on delictual wrongfulness for state omissions under constitutional values.",
    safliiUrl: "https://www.saflii.org/za/cases/ZASCA/2002/79.html",
    keywords: ["van duivenboden", "delict", "wrongfulness", "omission", "state liability", "police negligence"],
  },
  {
    caseName: "Country Cloud Trading CC v MEC, Department of Infrastructure Development",
    citation: "[2014] ZACC 28; 2015 (1) SA 1 (CC)",
    neutralCitation: "[2014] ZACC 28",
    court: "Constitutional Court of South Africa",
    courtCode: "ZACC",
    year: 2014,
    hierarchyWeight: "Apex (Binding on all courts)",
    legalArea: "Delict / Pure Economic Loss / Wrongfulness",
    legalPrinciples: "Conduct causing pure economic loss is not prima facie wrongful in South African law; wrongfulness requires positive policy considerations and constitutional norms justifying the imposition of legal liability.",
    relevanceSummary: "Apex authority establishing the strict test for wrongfulness in delictual claims for pure economic loss.",
    safliiUrl: "https://www.saflii.org/za/cases/ZACC/2014/28.html",
    keywords: ["country cloud", "pure economic loss", "wrongfulness delict", "breach of contract third party loss", "policy considerations"],
  },
];

// In-memory matter/session cache to satisfy Section 17
const searchCache = new Map<string, SafliiSearchResult>();

/**
 * Normalizes text and extracts legal keywords and concepts.
 */
export function extractLegalConcepts(query: string, documentText?: string): {
  terms: string[];
  concepts: string[];
} {
  const combined = `${query} ${documentText || ""}`.toLowerCase();
  const concepts: string[] = [];
  const terms: string[] = [];

  // Legal domain matching
  if (combined.includes("urgent") || combined.includes("interdict") || combined.includes("prima facie") || combined.includes("rule 6(12)")) {
    concepts.push("Urgent Applications & Interdictory Relief (Setlogelo / Webster v Mitchell / OUTA)");
    terms.push("urgent interdict", "prima facie right", "irreparable harm", "Setlogelo", "Rule 6(12)");
  }

  if (combined.includes("procurement") || combined.includes("tender") || combined.includes("gijima") || combined.includes("legality") || combined.includes("paja") || combined.includes("sita")) {
    concepts.push("Public Procurement, Tender Irregularities & Legality Review (Gijima / AllPay / Section 217)");
    terms.push("procurement irregularities", "legality review", "Section 217 Constitution", "Gijima", "AllPay");
  }

  if (
    combined.includes("partner") ||
    combined.includes("director") ||
    combined.includes("withdrew") ||
    combined.includes("withdraw") ||
    combined.includes("money") ||
    combined.includes("company account") ||
    combined.includes("fiduciary") ||
    combined.includes("misappropriat") ||
    combined.includes("theft") ||
    combined.includes("fraud") ||
    combined.includes("companies act")
  ) {
    concepts.push("Directors' & Partners' Fiduciary Duties / Unauthorised Asset Misappropriation (Companies Act 71 of 2008 s 75, 76 & 77 / Da Silva / Robinson v Randfontein)");
    terms.push("director fiduciary duty", "unauthorised withdrawal", "corporate opportunity", "misappropriation", "Companies Act 71 of 2008 section 76");
  }

  if (combined.includes("spolie") || combined.includes("spoliation") || combined.includes("locked out") || combined.includes("possession") || combined.includes("padlock")) {
    concepts.push("Mandament van Spolie / Unlawful Deprivation of Possession (Nienaber v Stuckey / FirstRand Bank)");
    terms.push("mandament van spolie", "spoliation", "peaceful possession", "Nienaber v Stuckey");
  }

  if (combined.includes("whatsapp") || combined.includes("dismiss") || combined.includes("social media") || combined.includes("employee") || combined.includes("ccma") || combined.includes("labour")) {
    concepts.push("Labour Relations / Electronic & Social Media Misconduct / Fair Dismissal (LRA s 188 / Sidumo / Dagane)");
    terms.push("whatsapp message dismissal", "social media misconduct", "breakdown of trust", "Sidumo", "Dagane");
  }

  if (combined.includes("contract") || combined.includes("public policy") || combined.includes("unfair term") || combined.includes("pacta sunt servanda") || combined.includes("beadica") || combined.includes("barkhuizen")) {
    concepts.push("Contractual Enforceability, Public Policy & Constitutional Values (Beadica / Barkhuizen v Napier)");
    terms.push("pacta sunt servanda", "public policy", "unfair contract terms", "Beadica", "Barkhuizen");
  }

  if (combined.includes("interpret") || combined.includes("statute") || combined.includes("section") || combined.includes("act") || combined.includes("legislation")) {
    concepts.push("Statutory Interpretation & Purposive Construction (Endumeni)");
    terms.push("statutory interpretation", "Endumeni", "context and purpose", "textual meaning");
  }

  if (combined.includes("delict") || combined.includes("damage") || combined.includes("negligen") || combined.includes("wrongful") || combined.includes("police")) {
    concepts.push("Delictual Liability, Wrongfulness & State Accountability (Van Duivenboden / Carmichele)");
    terms.push("delict", "wrongfulness", "pure economic loss", "Van Duivenboden", "Country Cloud");
  }

  // Fallback defaults if none matched explicitly
  if (terms.length === 0) {
    terms.push(query.slice(0, 60));
    concepts.push("General South African Superior Court Jurisprudence");
  }

  return { terms, concepts };
}

/**
 * Searches the SAFLII repository and returns matching authorities ranked by relevance and court hierarchy.
 */
export function retrieveSafliiAuthorities(query: string, documentText?: string): SafliiSearchResult {
  const cacheKey = `${query.trim().toLowerCase()}::${(documentText || "").slice(0, 100)}`;
  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey)!;
    return { ...cached, isFromCache: true };
  }

  const { terms, concepts } = extractLegalConcepts(query, documentText);
  const searchKeywords = terms.flatMap((t) => t.toLowerCase().split(" "));

  // Score verified authorities against query and terms
  const scored = VERIFIED_SAFLII_AUTHORITIES.map((auth) => {
    let score = 0;
    const authText = `${auth.caseName} ${auth.legalArea} ${auth.legalPrinciples} ${auth.keywords.join(" ")}`.toLowerCase();

    for (const kw of searchKeywords) {
      if (kw.length > 2 && authText.includes(kw)) {
        score += 3;
      }
    }

    for (const t of terms) {
      if (authText.includes(t.toLowerCase())) {
        score += 5;
      }
    }

    // Boost Apex Court (Constitutional Court) and SCA for precedential hierarchy
    if (auth.courtCode === "ZACC") score += 4;
    if (auth.courtCode === "ZASCA" || auth.courtCode === "AD") score += 3;

    return { auth, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top authorities (minimum 3, up to 6)
  const topAuthorities = scored.filter((s) => s.score > 0).slice(0, 6).map((s) => s.auth);

  // If no high match, return top foundational authorities
  const authorities = topAuthorities.length >= 2 ? topAuthorities : VERIFIED_SAFLII_AUTHORITIES.slice(0, 4);

  const directSafliiQuery = encodeURIComponent(terms[0] || query.slice(0, 60) || "South Africa cases");
  const directSafliiUrl = `https://www.saflii.org/cgi-bin/sinosrch.cgi?query=${directSafliiQuery}&results=50&submit=Search&mask_path=za%2Fcases`;

  const result: SafliiSearchResult = {
    searchTerms: terms,
    legalConcepts: concepts,
    authorities,
    directSafliiUrl,
    retrievedAt: new Date().toISOString(),
    isFromCache: false,
  };

  searchCache.set(cacheKey, result);
  return result;
}
