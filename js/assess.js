/* RICE Self-Assessment — vanilla JS, no dependencies.
   9 pillars x 3 questions PER SECTOR (domain-specific, not generic),
   each tagged by role (exec/mgr/officer). Scored against RICE's own
   maturity ladder: L1 Aware, L2 Developing, L3 Defined (baseline),
   L4 Managed, L5 Optimising. */
(function () {
  'use strict';

  var LADDER = {
    1: { name: 'Aware', blurb: 'Ad-hoc and reactive. No formal programme in this area.' },
    2: { name: 'Developing', blurb: 'Documented, but applied inconsistently.' },
    3: { name: 'Defined', blurb: 'Standardised and consistently applied - the RICE baseline.' },
    4: { name: 'Managed', blurb: 'Actively monitored, automated, quantified.' },
    5: { name: 'Optimising', blurb: 'Predictive, adaptive, continuously benchmarked.' }
  };

  var ROLES = [
    { id: 'exec', label: 'Executive & Board', desc: 'Strategic oversight questions - where cyber risk becomes a business decision.' },
    { id: 'mgr', label: 'Manager & Department Lead', desc: 'Operational questions - how policy actually gets carried out day to day.' },
    { id: 'officer', label: 'IT & Security Officer', desc: 'Technical questions - the controls themselves, in practice.' }
  ];

  var SECTORS = [
    { id: 'fsi', label: 'FSI', full: 'Financial Services', href: 'framework.html', status: 'live', statusLabel: 'LIVE - V1.0' },
    { id: 'healthcare', label: 'Healthcare', full: 'Healthcare', href: 'healthcare/framework.html', status: 'draft', statusLabel: '9/9 PILLARS DRAFTED' },
    { id: 'government', label: 'Government', full: 'Government & Critical Infrastructure', href: 'government/framework.html', status: 'draft', statusLabel: '9/9 PILLARS DRAFTED' },
    { id: 'manufacturing', label: 'Manufacturing', full: 'Manufacturing', href: 'manufacturing/framework.html', status: 'draft', statusLabel: '9/9 PILLARS DRAFTED' }
  ];

  function opt(L, text) { return { L: L, text: text }; }
  function q(pillar, pillarName, roles, text, options) {
    return { pillar: pillar, pillarName: pillarName, roles: roles, text: text, options: options };
  }

  var PN = {
    P1: 'Governance & Risk Oversight', P2: 'Threat Detection & Intelligence', P3: 'Identity & Access Governance',
    P4: 'Incident Response & Resilience', P5: 'Data Security & Privacy', P6: 'Supply Chain & Third-Party Risk',
    P7: 'Infrastructure Best Practices', P8: 'Secure Application Ecosystem', P9: 'Emerging Threat Horizon'
  };

  var QBANK_FSI = [
    q('P1', PN.P1, ['exec', 'mgr'], 'Does your organisation have a named owner accountable for cyber risk, reporting to the board per BNM RMiT?',
      [opt(1, 'No named owner'), opt(2, 'Informally assigned, not board-documented'), opt(3, 'Named and documented, reviewed annually'), opt(4, 'Reports metrics to the board quarterly'), opt(5, 'Board committee with published KPIs, externally benchmarked')]),
    q('P1', PN.P1, ['mgr', 'officer'], 'Is your risk appetite documented against BNM RMiT requirements and shared with relevant teams?',
      [opt(1, 'No defined risk appetite'), opt(2, 'Exists informally, not written down'), opt(3, 'Documented and shared with relevant teams'), opt(4, 'Drives budget and staffing decisions'), opt(5, 'Continuously recalibrated against incident and threat data')]),
    q('P1', PN.P1, ['officer'], 'Is RMiT compliance posture tracked continuously, or only discovered at audit time?',
      [opt(1, 'Only discovered during BNM audits'), opt(2, 'Manually checked occasionally'), opt(3, 'Reviewed on a defined schedule'), opt(4, 'Continuously monitored with automated dashboards'), opt(5, 'Predictive posture monitoring feeding board reporting')]),

    q('P2', PN.P2, ['exec', 'mgr'], 'Would leadership know within a day if a fraud-scale intrusion hit transaction systems?',
      [opt(1, 'No visibility until disruption is obvious'), opt(2, 'Would likely hear informally, no formal process'), opt(3, 'Defined escalation notifies leadership within 24 hours'), opt(4, 'Real-time dashboards give ongoing visibility'), opt(5, 'Predictive alerts flag likely fraud before it escalates')]),
    q('P2', PN.P2, ['mgr', 'officer'], 'Is there 24/7 SOC coverage for core banking and payment systems?',
      [opt(1, 'No monitoring in place'), opt(2, 'Ad hoc checks during business hours'), opt(3, 'Business-hours monitoring with on-call escalation'), opt(4, '24/7 coverage via internal team or MSSP'), opt(5, '24/7 coverage with proactive threat-hunting')]),
    q('P2', PN.P2, ['officer'], 'Are detection rules tuned to fraud and transaction-pattern anomalies, or default vendor settings?',
      [opt(1, 'No detection tooling deployed'), opt(2, 'Default vendor rules only'), opt(3, 'Custom rules for known critical assets'), opt(4, 'Regularly tuned against real telemetry'), opt(5, 'Continuously refined using fraud intel and red-team findings')]),

    q('P3', PN.P3, ['exec', 'mgr'], 'Do you know how many staff currently hold privileged access to core banking systems?',
      [opt(1, 'No visibility into privileged access'), opt(2, 'Rough idea, no formal register'), opt(3, 'Documented register, reviewed occasionally'), opt(4, 'Reviewed on a fixed schedule with removal SLAs'), opt(5, 'Continuously monitored with anomaly alerts')]),
    q('P3', PN.P3, ['mgr', 'officer'], 'Is access removed promptly on staff exit, consistent with segregation-of-duties requirements?',
      [opt(1, 'No formal offboarding process'), opt(2, 'Manual, often delayed'), opt(3, 'Defined process, usually within days'), opt(4, 'Automated, tied to HR system, same-day'), opt(5, 'Automated and audited, exceptions reported to management')]),
    q('P3', PN.P3, ['officer'], 'Is MFA enforced for all privileged and core-banking system access?',
      [opt(1, 'No MFA in use'), opt(2, 'MFA available but optional'), opt(3, 'Required for some privileged accounts'), opt(4, 'Required for all privileged and remote access'), opt(5, 'Phishing-resistant MFA, continuously verified')]),

    q('P4', PN.P4, ['exec', 'mgr'], 'Has leadership rehearsed an incident response plan that meets BNM notification timelines?',
      [opt(1, 'No incident response plan exists'), opt(2, 'A plan exists but has never been tested'), opt(3, 'Tested at least once'), opt(4, 'Tested annually with leadership participation'), opt(5, 'Regularly rehearsed, refined after every real incident')]),
    q('P4', PN.P4, ['mgr', 'officer'], 'How would a ransomware event affect your ability to process customer transactions?',
      [opt(1, 'Unknown - never assessed'), opt(2, 'Would likely halt processing for an extended period'), opt(3, 'Documented fallback procedures for critical processes'), opt(4, 'Tested fallback with defined recovery targets'), opt(5, 'Proven ability to maintain critical operations through an event')]),
    q('P4', PN.P4, ['officer'], 'Are core-banking backups tested for actual restoration, not just completion?',
      [opt(1, 'No regular backups'), opt(2, 'Backups run but restoration never tested'), opt(3, 'Restoration tested occasionally'), opt(4, 'Restoration tested on a fixed schedule'), opt(5, 'Automated restoration testing with RTO/RPO verification')]),

    q('P5', PN.P5, ['exec', 'mgr'], 'Do you know where customer financial data - PII, account, transaction history - actually lives?',
      [opt(1, 'No data classification exercise done'), opt(2, 'General awareness, not documented'), opt(3, 'Identified and documented'), opt(4, 'Classification drives access and control decisions'), opt(5, 'Continuously maintained inventory tied to risk scoring')]),
    q('P5', PN.P5, ['mgr', 'officer'], 'Is customer financial data encrypted at rest and in transit, consistently?',
      [opt(1, 'No encryption in place'), opt(2, 'Used inconsistently'), opt(3, 'Standard for known sensitive systems'), opt(4, 'Enforced organisation-wide, exceptions tracked'), opt(5, 'Enforced and verified continuously, including third-party systems')]),
    q('P5', PN.P5, ['officer'], 'Do you have DLP controls to catch customer financial data leaving improperly?',
      [opt(1, 'No DLP or monitoring in place'), opt(2, 'Basic email/file monitoring only'), opt(3, 'Deployed for known sensitive data types'), opt(4, 'Tuned and actively alerting'), opt(5, 'Integrated with automated response and investigation')]),

    q('P6', PN.P6, ['exec', 'mgr'], 'Do you know which vendors and fintech partners can access your core banking systems?',
      [opt(1, 'No vendor inventory exists'), opt(2, 'Rough list, not risk-tiered'), opt(3, 'Documented inventory with risk tiering'), opt(4, 'Tiering drives contract and monitoring requirements'), opt(5, 'Continuously reassessed as relationships change')]),
    q('P6', PN.P6, ['mgr', 'officer'], 'Are security requirements written into vendor and fintech partnership contracts?',
      [opt(1, 'No security clauses in contracts'), opt(2, 'Generic clauses, rarely enforced'), opt(3, 'Standard clauses for new contracts'), opt(4, 'Enforced with periodic vendor assessments'), opt(5, 'Contractually enforced with audit rights, regularly exercised')]),
    q('P6', PN.P6, ['officer'], "Do you verify a vendor's NACSA licensing and security posture before granting access?",
      [opt(1, 'No verification before access is granted'), opt(2, 'Informal assurance only'), opt(3, 'Security questionnaire required before onboarding'), opt(4, 'Evidence-based verification - certs, pentest reports'), opt(5, 'Continuous vendor risk monitoring, not just at onboarding')]),

    q('P7', PN.P7, ['exec', 'mgr'], 'Is your network segmented so a compromise in one system cannot reach core banking?',
      [opt(1, 'Flat network, no segmentation'), opt(2, 'Some segmentation, inconsistently maintained'), opt(3, 'Defined segmentation for critical systems'), opt(4, 'Actively enforced and monitored'), opt(5, 'Zero-trust architecture, continuously verified')]),
    q('P7', PN.P7, ['mgr', 'officer'], 'Is there a defined patch management process with target timelines for internet-facing banking systems?',
      [opt(1, 'No formal patch process'), opt(2, 'Patches applied reactively, no timelines'), opt(3, 'Defined SLAs for critical systems'), opt(4, 'SLAs enforced and tracked organisation-wide'), opt(5, 'Automated patching with real-time compliance dashboards')]),
    q('P7', PN.P7, ['officer'], 'Are legacy core-banking systems that cannot be patched specifically compensated for?',
      [opt(1, 'No inventory of legacy systems'), opt(2, 'Known informally, no compensating controls'), opt(3, 'Documented with basic compensating controls'), opt(4, 'Actively monitored with layered controls'), opt(5, 'Formal risk-acceptance process, continuously reassessed')]),

    q('P8', PN.P8, ['exec', 'mgr'], 'Is security considered before digital banking apps go live, or mainly after an incident?',
      [opt(1, 'Only considered after an incident'), opt(2, 'Reviewed informally before major launches'), opt(3, 'Security review required before go-live'), opt(4, 'Integrated into the development process'), opt(5, 'Automated security testing in every deployment')]),
    q('P8', PN.P8, ['mgr', 'officer'], 'Are digital banking apps and APIs tested for vulnerabilities before and after release?',
      [opt(1, 'No security testing performed'), opt(2, 'Occasional testing, no fixed schedule'), opt(3, 'Testing required before major releases'), opt(4, 'Regular testing plus ongoing scanning'), opt(5, 'Continuous automated testing in CI/CD')]),
    q('P8', PN.P8, ['officer'], 'Are open banking APIs tested for authorization flaws, not just uptime?',
      [opt(1, 'Not specifically tested for security'), opt(2, 'Basic functional testing only'), opt(3, 'Security testing for major APIs before launch'), opt(4, 'Regular authorization and access-control testing'), opt(5, 'Continuous API security testing with automated regression')]),

    q('P9', PN.P9, ['exec', 'mgr'], 'Has leadership discussed AI-driven fraud or quantum risk to encryption as a business issue?',
      [opt(1, 'Not discussed at leadership level'), opt(2, 'Aware but not yet addressed'), opt(3, 'Discussed and assigned to someone to monitor'), opt(4, 'Actively planning mitigations'), opt(5, 'Actively investing ahead of the risk')]),
    q('P9', PN.P9, ['mgr', 'officer'], 'Do you have visibility into new fintech integrations and API partners joining your ecosystem?',
      [opt(1, 'No visibility into new integrations'), opt(2, 'Discovered informally, no process'), opt(3, 'New integrations reviewed before connecting'), opt(4, 'Ongoing discovery and risk assessment'), opt(5, 'Automated discovery with continuous reassessment')]),
    q('P9', PN.P9, ['officer'], 'Is anyone tracking emerging threats specific to banking - deepfake fraud, AI-driven scams?',
      [opt(1, 'No one tracking emerging threats'), opt(2, 'Informal awareness only'), opt(3, 'Someone assigned to monitor relevant advisories'), opt(4, 'Regular review cadence feeding into planning'), opt(5, 'Active research or pilot programme addressing emerging risk')])
  ];

  var QBANK_HEALTHCARE = [
    q('P1', PN.P1, ['exec', 'mgr'], 'Is there a named owner accountable for cyber risk who sits in joint clinical and IT leadership?',
      [opt(1, 'No named owner'), opt(2, 'Informally assigned, not documented'), opt(3, 'Formally named and documented, reviewed annually'), opt(4, 'Reports metrics to leadership quarterly'), opt(5, 'Joint clinical-board committee with published KPIs')]),
    q('P1', PN.P1, ['mgr', 'officer'], 'Is your risk appetite weighted by patient-safety impact, not just financial exposure?',
      [opt(1, 'No defined risk appetite'), opt(2, 'Exists informally, not written down'), opt(3, 'Documented and shared with relevant teams'), opt(4, 'Drives budget and staffing decisions'), opt(5, 'Continuously recalibrated against real incident data')]),
    q('P1', PN.P1, ['officer'], 'Is HIPAA/PDPA compliance posture tracked continuously, or only discovered at audit time?',
      [opt(1, 'Only discovered during external audits'), opt(2, 'Manually checked occasionally'), opt(3, 'Reviewed on a defined schedule'), opt(4, 'Continuously monitored with automated dashboards'), opt(5, 'Predictive posture monitoring feeding leadership reporting')]),

    q('P2', PN.P2, ['exec', 'mgr'], 'Would leadership know within a day if there was a serious intrusion into the EHR?',
      [opt(1, 'No visibility until disruption is obvious'), opt(2, 'Would likely hear informally, no formal process'), opt(3, 'Defined escalation notifies leadership within 24 hours'), opt(4, 'Real-time dashboards give ongoing visibility'), opt(5, 'Predictive alerts flag likely incidents before they escalate')]),
    q('P2', PN.P2, ['mgr', 'officer'], 'Is there 24/7 monitoring coverage matching round-the-clock clinical operations?',
      [opt(1, 'No monitoring in place'), opt(2, 'Ad hoc checks during business hours'), opt(3, 'Business-hours monitoring with on-call escalation'), opt(4, '24/7 coverage via internal team or MSSP'), opt(5, '24/7 coverage with proactive threat-hunting')]),
    q('P2', PN.P2, ['officer'], 'Are detection rules tuned to clinical anomalies - break-glass overuse, bulk PHI pulls?',
      [opt(1, 'No detection tooling deployed'), opt(2, 'Default vendor rules only'), opt(3, 'Custom rules for known critical assets'), opt(4, 'Regularly tuned against real telemetry'), opt(5, 'Continuously refined using clinical-access-pattern analysis')]),

    q('P3', PN.P3, ['exec', 'mgr'], 'Do you know how many staff currently hold break-glass or privileged EHR access?',
      [opt(1, 'No visibility into privileged access'), opt(2, 'Rough idea, no formal register'), opt(3, 'Documented register, reviewed occasionally'), opt(4, 'Reviewed on a fixed schedule with removal SLAs'), opt(5, 'Continuously monitored with anomaly alerts')]),
    q('P3', PN.P3, ['mgr', 'officer'], 'Is access removed promptly when clinical staff change role or leave?',
      [opt(1, 'No formal offboarding process'), opt(2, 'Manual, often delayed'), opt(3, 'Defined process, usually within days'), opt(4, 'Automated, tied to credentialing system, same-day'), opt(5, 'Automated and audited, exceptions reported to management')]),
    q('P3', PN.P3, ['officer'], 'Is break-glass emergency access reviewed after every use, and MFA enforced elsewhere?',
      [opt(1, 'No MFA, break-glass never reviewed'), opt(2, 'MFA optional, break-glass rarely reviewed'), opt(3, 'MFA required for privileged accounts, break-glass logged'), opt(4, 'MFA everywhere feasible, break-glass reviewed within 24h'), opt(5, 'Phishing-resistant MFA, break-glass reviewed and reported automatically')]),

    q('P4', PN.P4, ['exec', 'mgr'], 'Has leadership rehearsed a ransomware plan that includes patient-care continuity procedures?',
      [opt(1, 'No incident response plan exists'), opt(2, 'A plan exists but has never been tested'), opt(3, 'Tested at least once'), opt(4, 'Tested annually with clinical leadership participation'), opt(5, 'Regularly rehearsed, refined after every real incident')]),
    q('P4', PN.P4, ['mgr', 'officer'], 'How would a ransomware event affect your ability to keep treating patients?',
      [opt(1, 'Unknown - never assessed'), opt(2, 'Would likely halt patient care for an extended period'), opt(3, 'Documented offline/paper fallback for critical care areas'), opt(4, 'Tested fallback with defined recovery targets'), opt(5, 'Proven ability to maintain patient care through an event')]),
    q('P4', PN.P4, ['officer'], 'Are EHR backups tested for actual restoration, not just confirmed as completed?',
      [opt(1, 'No regular backups'), opt(2, 'Backups run but restoration never tested'), opt(3, 'Restoration tested occasionally'), opt(4, 'Restoration tested on a fixed schedule'), opt(5, 'Automated restoration testing with RTO/RPO verification')]),

    q('P5', PN.P5, ['exec', 'mgr'], 'Do you know where patient health information (PHI) actually lives across your systems?',
      [opt(1, 'No data classification exercise done'), opt(2, 'General awareness, not documented'), opt(3, 'Identified and documented'), opt(4, 'Classification drives access and control decisions'), opt(5, 'Continuously maintained inventory tied to risk scoring')]),
    q('P5', PN.P5, ['mgr', 'officer'], 'Is PHI encrypted at rest and in transit, including on legacy medical devices where feasible?',
      [opt(1, 'No encryption in place'), opt(2, 'Used inconsistently'), opt(3, 'Standard for known sensitive systems'), opt(4, 'Enforced organisation-wide, exceptions tracked'), opt(5, 'Enforced and verified continuously, including devices')]),
    q('P5', PN.P5, ['officer'], 'Do you have DLP tuned to PHI patterns - MRNs, diagnosis codes - not generic PII?',
      [opt(1, 'No DLP or monitoring in place'), opt(2, 'Basic email/file monitoring only'), opt(3, 'Deployed for known PHI data types'), opt(4, 'Tuned and actively alerting'), opt(5, 'Integrated with automated response and investigation')]),

    q('P6', PN.P6, ['exec', 'mgr'], 'Do you know which vendors and device manufacturers can access PHI or the clinical network?',
      [opt(1, 'No vendor inventory exists'), opt(2, 'Rough list, not risk-tiered'), opt(3, 'Documented inventory with risk tiering'), opt(4, 'Tiering drives contract and monitoring requirements'), opt(5, 'Continuously reassessed as relationships change')]),
    q('P6', PN.P6, ['mgr', 'officer'], 'Are Business Associate Agreements (or equivalent) required for all PHI-touching vendors?',
      [opt(1, 'No security/BAA clauses in vendor contracts'), opt(2, 'Generic clauses, rarely enforced'), opt(3, 'Standard BAAs for new PHI-touching vendors'), opt(4, 'Enforced with periodic vendor assessments'), opt(5, 'Contractually enforced with audit rights, regularly exercised')]),
    q('P6', PN.P6, ['officer'], 'Do you collect a device security disclosure (MDS2 or equivalent) before purchasing connected medical equipment?',
      [opt(1, 'No verification before purchase'), opt(2, 'Informal assurance only'), opt(3, 'Security questionnaire required before onboarding'), opt(4, 'Evidence-based disclosure required - MDS2, pentest reports'), opt(5, 'Continuous device risk monitoring, not just at purchase')]),

    q('P7', PN.P7, ['exec', 'mgr'], 'Is the clinical and medical-device network segmented from general administrative IT?',
      [opt(1, 'Flat network, no segmentation'), opt(2, 'Some segmentation, inconsistently maintained'), opt(3, 'Defined segmentation for critical systems'), opt(4, 'Actively enforced and monitored'), opt(5, 'Zero-trust architecture, continuously verified')]),
    q('P7', PN.P7, ['mgr', 'officer'], 'Does your patch process account for FDA-validated device patch windows, not a generic IT cadence?',
      [opt(1, 'No formal patch process'), opt(2, 'Patches applied reactively, no timelines'), opt(3, 'Defined SLAs accounting for device validation windows'), opt(4, 'SLAs enforced and tracked organisation-wide'), opt(5, 'Automated patching with real-time compliance dashboards')]),
    q('P7', PN.P7, ['officer'], 'Are legacy medical devices that cannot be patched specifically compensated for?',
      [opt(1, 'No inventory of legacy devices'), opt(2, 'Known informally, no compensating controls'), opt(3, 'Documented with basic compensating controls'), opt(4, 'Actively monitored with layered controls'), opt(5, 'Formal risk-acceptance process, continuously reassessed')]),

    q('P8', PN.P8, ['exec', 'mgr'], 'Is security considered before patient portals or telemedicine platforms go live?',
      [opt(1, 'Only considered after an incident'), opt(2, 'Reviewed informally before major launches'), opt(3, 'Security review required before go-live'), opt(4, 'Integrated into the development process'), opt(5, 'Automated security testing in every deployment')]),
    q('P8', PN.P8, ['mgr', 'officer'], 'Are patient-facing applications tested for vulnerabilities before and after release?',
      [opt(1, 'No security testing performed'), opt(2, 'Occasional testing, no fixed schedule'), opt(3, 'Testing required before major releases'), opt(4, 'Regular testing plus ongoing scanning'), opt(5, 'Continuous automated testing in CI/CD')]),
    q('P8', PN.P8, ['officer'], 'Are HL7/FHIR integration endpoints tested for injection and authorization flaws?',
      [opt(1, 'Not specifically tested for security'), opt(2, 'Basic functional testing only'), opt(3, 'Security testing before launch'), opt(4, 'Regular authorization and access-control testing'), opt(5, 'Continuous testing with automated regression checks')]),

    q('P9', PN.P9, ['exec', 'mgr'], 'Has leadership discussed AI-diagnostic or connected-device risk as a patient-safety issue?',
      [opt(1, 'Not discussed at leadership level'), opt(2, 'Aware but not yet addressed'), opt(3, 'Discussed and assigned to someone to monitor'), opt(4, 'Actively planning mitigations'), opt(5, 'Actively investing ahead of the risk')]),
    q('P9', PN.P9, ['mgr', 'officer'], 'Do you have visibility into new connected medical devices (IoMT) joining your network?',
      [opt(1, 'No visibility into new device types'), opt(2, 'Discovered informally, no process'), opt(3, 'New devices reviewed before connecting'), opt(4, 'Ongoing discovery and risk assessment process'), opt(5, 'Automated discovery with continuous reassessment')]),
    q('P9', PN.P9, ['officer'], 'Is anyone tracking emerging risk in AI diagnostics or IoMT specific to your facility?',
      [opt(1, 'No one tracking emerging threats'), opt(2, 'Informal awareness only'), opt(3, 'Someone assigned to monitor relevant advisories'), opt(4, 'Regular review cadence feeding into planning'), opt(5, 'Active research or pilot programme addressing emerging risk')])
  ];

  var QBANK_GOVERNMENT = [
    q('P1', PN.P1, ['exec', 'mgr'], 'Is there a named owner accountable for cyber risk on citizen-facing systems - not diffuse ownership across departments?',
      [opt(1, 'No named owner'), opt(2, 'Informally assigned, not documented'), opt(3, 'Formally named and documented, reviewed annually'), opt(4, 'Reports metrics to leadership quarterly'), opt(5, 'Committee with published KPIs, externally benchmarked')]),
    q('P1', PN.P1, ['mgr', 'officer'], 'Is your risk appetite weighted by citizen-trust impact, not system uptime alone?',
      [opt(1, 'No defined risk appetite'), opt(2, 'Exists informally, not written down'), opt(3, 'Documented and shared with relevant teams'), opt(4, 'Drives budget and staffing decisions'), opt(5, 'Continuously recalibrated against real incident data')]),
    q('P1', PN.P1, ['officer'], "Are you voluntarily applying PDPA-equivalent controls, given PDPA doesn't legally bind government systems?",
      [opt(1, 'No - treated as out of scope'), opt(2, 'Discussed, not yet implemented'), opt(3, 'Applied to some citizen-facing systems'), opt(4, 'Applied consistently across citizen-data systems'), opt(5, 'Formal voluntary-compliance programme, independently reviewed')]),

    q('P2', PN.P2, ['exec', 'mgr'], 'Would leadership know within a day if there was unauthorized bulk access to a citizen database?',
      [opt(1, 'No visibility until disruption is obvious'), opt(2, 'Would likely hear informally, no formal process'), opt(3, 'Defined escalation notifies leadership within 24 hours'), opt(4, 'Real-time dashboards give ongoing visibility'), opt(5, 'Predictive alerts flag likely incidents before they escalate')]),
    q('P2', PN.P2, ['mgr', 'officer'], 'Is there centralised monitoring across your consolidated citizen-facing systems, or siloed per agency?',
      [opt(1, 'No centralised monitoring'), opt(2, 'Siloed, ad hoc per system'), opt(3, 'Centralised for some critical systems'), opt(4, 'Centralised across all major citizen systems'), opt(5, 'Centralised with cross-agency correlation and proactive hunting')]),
    q('P2', PN.P2, ['officer'], 'Are you monitoring for anomalous bulk data access by privileged accounts?',
      [opt(1, 'No detection tooling deployed'), opt(2, 'Default vendor rules only'), opt(3, 'Custom rules for known critical assets'), opt(4, 'Regularly tuned against real telemetry'), opt(5, 'Continuously refined, alerts trigger immediate review')]),

    q('P3', PN.P3, ['exec', 'mgr'], 'Do you know how many staff and vendors currently hold privileged access to citizen databases?',
      [opt(1, 'No visibility into privileged access'), opt(2, 'Rough idea, no formal register'), opt(3, 'Documented register, reviewed occasionally'), opt(4, 'Reviewed on a fixed schedule with removal SLAs'), opt(5, 'Continuously monitored with anomaly alerts')]),
    q('P3', PN.P3, ['mgr', 'officer'], 'Are standing privileged accounts eliminated in favour of time-bound, logged access grants?',
      [opt(1, 'Standing privileged accounts are the norm'), opt(2, 'Some time-bound access, inconsistently applied'), opt(3, 'Time-bound access required for new grants'), opt(4, 'Enforced with automatic expiry and revocation SLAs'), opt(5, 'Zero standing access, continuously audited')]),
    q('P3', PN.P3, ['officer'], 'Is MFA enforced for all civil-servant and vendor access to citizen-data systems?',
      [opt(1, 'No MFA in use'), opt(2, 'MFA available but optional'), opt(3, 'Required for some privileged accounts'), opt(4, 'Required for all privileged and remote access'), opt(5, 'Phishing-resistant MFA, continuously verified')]),

    q('P4', PN.P4, ['exec', 'mgr'], 'Has leadership rehearsed an incident plan that meets Cybersecurity Act 2024 notification timelines?',
      [opt(1, 'No incident response plan exists'), opt(2, 'A plan exists but has never been tested'), opt(3, 'Tested at least once'), opt(4, 'Tested annually with leadership participation'), opt(5, 'Regularly rehearsed, refined after every real incident')]),
    q('P4', PN.P4, ['mgr', 'officer'], 'Is there a cross-agency breach coordination protocol, given a breach in one system affects trust in all linked systems?',
      [opt(1, 'No cross-agency coordination protocol'), opt(2, 'Informal, ad hoc coordination only'), opt(3, 'Documented protocol for major systems'), opt(4, 'Tested with participating agencies'), opt(5, 'Proven coordination with public communication built in')]),
    q('P4', PN.P4, ['officer'], 'Are citizen-database backups tested for actual restoration, not just completion?',
      [opt(1, 'No regular backups'), opt(2, 'Backups run but restoration never tested'), opt(3, 'Restoration tested occasionally'), opt(4, 'Restoration tested on a fixed schedule'), opt(5, 'Automated restoration testing with RTO/RPO verification')]),

    q('P5', PN.P5, ['exec', 'mgr'], 'Do you know what sensitive citizen data - IC numbers, biometrics, health data - exists and where?',
      [opt(1, 'No data classification exercise done'), opt(2, 'General awareness, not documented'), opt(3, 'Identified and documented'), opt(4, 'Classification drives access and control decisions'), opt(5, 'Continuously maintained inventory tied to risk scoring')]),
    q('P5', PN.P5, ['mgr', 'officer'], 'Is citizen data encrypted at rest and in transit across consolidated systems?',
      [opt(1, 'No encryption in place'), opt(2, 'Used inconsistently'), opt(3, 'Standard for known sensitive systems'), opt(4, 'Enforced organisation-wide, exceptions tracked'), opt(5, 'Enforced and verified continuously, including third-party systems')]),
    q('P5', PN.P5, ['officer'], 'Is a Data Protection Impact Assessment conducted before new cross-agency data-sharing initiatives?',
      [opt(1, 'No DPIA process exists'), opt(2, 'Done informally, undocumented'), opt(3, 'Required for major new initiatives'), opt(4, 'Required and reviewed by an independent party'), opt(5, 'Standard practice, publicly summarised for transparency')]),

    q('P6', PN.P6, ['exec', 'mgr'], 'Do you know which vendors and third-party managers can access citizen systems?',
      [opt(1, 'No vendor inventory exists'), opt(2, 'Rough list, not risk-tiered'), opt(3, 'Documented inventory with risk tiering'), opt(4, 'Tiering drives contract and monitoring requirements'), opt(5, 'Continuously reassessed as relationships change')]),
    q('P6', PN.P6, ['mgr', 'officer'], 'Are security-critical system vendors selected through open, competitive tender with security review?',
      [opt(1, 'No formal tender or security review process'), opt(2, 'Tender process exists, security review inconsistent'), opt(3, 'Security review standard for new critical vendors'), opt(4, 'Independently verified before award'), opt(5, 'Continuous vendor risk monitoring post-award')]),
    q('P6', PN.P6, ['officer'], 'Do you verify NACSA licensing for cybersecurity service providers before and during engagement?',
      [opt(1, 'No verification before access is granted'), opt(2, 'Informal assurance only'), opt(3, 'Licensing checked before onboarding'), opt(4, 'Evidence-based verification, documented'), opt(5, 'Continuous licensing status monitoring')]),

    q('P7', PN.P7, ['exec', 'mgr'], 'Are citizen-facing systems segmented from internal government administrative networks?',
      [opt(1, 'Flat network, no segmentation'), opt(2, 'Some segmentation, inconsistently maintained'), opt(3, 'Defined segmentation for critical systems'), opt(4, 'Actively enforced and monitored'), opt(5, 'Zero-trust architecture, continuously verified')]),
    q('P7', PN.P7, ['mgr', 'officer'], 'Is there a defined patch SLA for internet-facing government systems?',
      [opt(1, 'No formal patch process'), opt(2, 'Patches applied reactively, no timelines'), opt(3, 'Defined SLAs for critical systems'), opt(4, 'SLAs enforced and tracked organisation-wide'), opt(5, 'Automated patching with real-time compliance dashboards')]),
    q('P7', PN.P7, ['officer'], 'Is zero-trust architecture applied to inter-agency data connections, or is trust assumed between agencies?',
      [opt(1, 'Trust assumed between agencies by default'), opt(2, 'Some controls, inconsistently applied'), opt(3, 'Defined verification for major inter-agency links'), opt(4, 'Actively enforced and monitored'), opt(5, 'Full zero-trust, continuously verified')]),

    q('P8', PN.P8, ['exec', 'mgr'], 'Is independent security assessment conducted before major citizen-facing system launches?',
      [opt(1, 'Only assessed after an incident'), opt(2, 'Reviewed informally before major launches'), opt(3, 'Independent assessment required before go-live'), opt(4, 'Assessment plus public transparency summary'), opt(5, 'Automated security testing in every deployment')]),
    q('P8', PN.P8, ['mgr', 'officer'], 'Are citizen-facing portals tested for credential-stuffing resilience and other common attacks?',
      [opt(1, 'No security testing performed'), opt(2, 'Occasional testing, no fixed schedule'), opt(3, 'Testing required before major releases'), opt(4, 'Regular testing plus ongoing scanning'), opt(5, 'Continuous automated testing integrated into deployment')]),
    q('P8', PN.P8, ['officer'], 'Are cross-system API integrations (linking major citizen databases) tested for authorization flaws?',
      [opt(1, 'Not specifically tested for security'), opt(2, 'Basic functional testing only'), opt(3, 'Security testing for major APIs before launch'), opt(4, 'Regular authorization and access-control testing'), opt(5, 'Continuous testing with automated regression checks')]),

    q('P9', PN.P9, ['exec', 'mgr'], 'Has leadership discussed AI-driven disinformation risk to official government communications?',
      [opt(1, 'Not discussed at leadership level'), opt(2, 'Aware but not yet addressed'), opt(3, 'Discussed and assigned to someone to monitor'), opt(4, 'Actively planning mitigations'), opt(5, 'Actively investing ahead of the risk')]),
    q('P9', PN.P9, ['mgr', 'officer'], 'Do you have any governance in place for government use of generative AI in citizen services?',
      [opt(1, 'No governance in place'), opt(2, 'Informal guidance only'), opt(3, 'Documented policy for major use cases'), opt(4, 'Policy enforced with review process'), opt(5, 'Comprehensive framework, publicly published')]),
    q('P9', PN.P9, ['officer'], 'Is anyone tracking post-quantum risk for long-lived national identity data?',
      [opt(1, 'No one tracking this risk'), opt(2, 'Informal awareness only'), opt(3, 'Someone assigned to monitor relevant advisories'), opt(4, 'Regular review cadence feeding into planning'), opt(5, 'Active migration planning underway')])
  ];

  var QBANK_MANUFACTURING = [
    q('P1', PN.P1, ['exec', 'mgr'], 'Is your risk appetite explicitly tied to production-downtime cost and fine exposure, not abstract risk scoring?',
      [opt(1, 'No defined risk appetite'), opt(2, 'Exists informally, not written down'), opt(3, 'Documented in terms of downtime/fine exposure'), opt(4, 'Drives budget and staffing decisions'), opt(5, 'Continuously recalibrated against real incident data')]),
    q('P1', PN.P1, ['mgr', 'officer'], 'Is there joint OT/IT governance with plant-manager and IT leadership sharing accountability?',
      [opt(1, 'No joint governance - siloed OT and IT'), opt(2, 'Informal coordination, not documented'), opt(3, 'Documented joint governance structure'), opt(4, 'Active shared reporting and decision-making'), opt(5, 'Fully integrated OT/IT governance with published metrics')]),
    q('P1', PN.P1, ['officer'], 'Has an honest baseline security assessment been done - an L1 starting point, not aspirational framing?',
      [opt(1, 'No baseline assessment done'), opt(2, 'Informal, undocumented estimate'), opt(3, 'Documented baseline with a realistic starting maturity'), opt(4, 'Baseline drives a defined improvement roadmap'), opt(5, 'Continuously reassessed against measurable triggers')]),

    q('P2', PN.P2, ['exec', 'mgr'], 'Would leadership know about a ransomware precursor before the production line actually stops?',
      [opt(1, 'No visibility until the line stops'), opt(2, 'Would likely hear informally, no formal process'), opt(3, 'Defined escalation notifies leadership quickly'), opt(4, 'Real-time dashboards give ongoing visibility'), opt(5, 'Predictive alerts flag precursors before impact')]),
    q('P2', PN.P2, ['mgr', 'officer'], 'Is OT-aware monitoring deployed, distinct from generic IT security tooling?',
      [opt(1, 'No OT-specific monitoring'), opt(2, 'Generic IT tools applied to OT, poorly fitted'), opt(3, 'Some OT-aware detection for critical assets'), opt(4, 'Dedicated OT monitoring, actively maintained'), opt(5, 'Continuously tuned OT monitoring with threat intel')]),
    q('P2', PN.P2, ['officer'], 'Has a baseline of "normal" OT network behaviour been established before deploying anomaly detection?',
      [opt(1, 'No baseline established'), opt(2, 'Informal understanding, undocumented'), opt(3, 'Documented baseline for critical segments'), opt(4, 'Baseline actively used to tune detection'), opt(5, 'Continuously updated baseline as OT environment evolves')]),

    q('P3', PN.P3, ['exec', 'mgr'], 'Do you know how many people and vendors currently have remote access to your OT network?',
      [opt(1, 'No visibility into remote OT access'), opt(2, 'Rough idea, no formal register'), opt(3, 'Documented register, reviewed occasionally'), opt(4, 'Reviewed on a fixed schedule with removal SLAs'), opt(5, 'Continuously monitored with anomaly alerts')]),
    q('P3', PN.P3, ['mgr', 'officer'], 'Is OEM and integrator remote access time-bound and disabled outside maintenance windows?',
      [opt(1, 'Remote access left enabled by default'), opt(2, 'Informally managed, inconsistent'), opt(3, 'Time-bound access for major vendors'), opt(4, 'Enforced with automatic disabling outside windows'), opt(5, 'Fully automated, logged and audited')]),
    q('P3', PN.P3, ['officer'], 'Is MFA enforced for remote access to OT networks?',
      [opt(1, 'No MFA in use'), opt(2, 'MFA available but optional'), opt(3, 'Required for some remote access'), opt(4, 'Required for all remote OT access'), opt(5, 'Phishing-resistant MFA, continuously verified')]),

    q('P4', PN.P4, ['exec', 'mgr'], 'Does your ransomware containment plan isolate OT from IT without halting the entire plant?',
      [opt(1, 'No containment plan exists'), opt(2, 'Plan exists but assumes full shutdown'), opt(3, 'Documented selective-isolation procedure'), opt(4, 'Tested selective isolation with defined scope'), opt(5, 'Proven ability to contain while preserving safe production')]),
    q('P4', PN.P4, ['mgr', 'officer'], 'Are manual or offline fallback procedures defined for critical production processes?',
      [opt(1, 'No fallback procedures exist'), opt(2, 'Informal knowledge, undocumented'), opt(3, 'Documented fallback for critical processes'), opt(4, 'Tested fallback with defined recovery targets'), opt(5, 'Proven ability to sustain critical production manually')]),
    q('P4', PN.P4, ['officer'], 'Are OT configuration and historian backups tested for actual restoration?',
      [opt(1, 'No regular backups'), opt(2, 'Backups run but restoration never tested'), opt(3, 'Restoration tested occasionally'), opt(4, 'Restoration tested on a fixed schedule'), opt(5, 'Automated restoration testing with RTO/RPO verification')]),

    q('P5', PN.P5, ['exec', 'mgr'], 'Is proprietary process and product data treated as the primary data-security concern, not just personal data?',
      [opt(1, 'Process/product data not specifically protected'), opt(2, 'Informal awareness, no controls'), opt(3, 'Documented classification and access restrictions'), opt(4, 'Actively enforced access controls'), opt(5, 'Continuously monitored with leak detection')]),
    q('P5', PN.P5, ['mgr', 'officer'], 'Is OT historian data encrypted in transit to any cloud or analytics platform?',
      [opt(1, 'No encryption in place'), opt(2, 'Used inconsistently'), opt(3, 'Standard for known data flows'), opt(4, 'Enforced across all historian-to-cloud connections'), opt(5, 'Enforced and continuously verified')]),
    q('P5', PN.P5, ['officer'], 'Is access to recipe and process-parameter data classified and restricted?',
      [opt(1, 'No restrictions in place'), opt(2, 'Informal restrictions, inconsistently applied'), opt(3, 'Documented classification with basic restrictions'), opt(4, 'Actively enforced role-based restrictions'), opt(5, 'Continuously monitored access with anomaly detection')]),

    q('P6', PN.P6, ['exec', 'mgr'], 'Do you have a complete inventory of OEM and integrator remote-access relationships to your OT network?',
      [opt(1, 'No inventory exists'), opt(2, 'Rough list, not risk-tiered'), opt(3, 'Documented inventory with risk tiering'), opt(4, 'Tiering drives contract and monitoring requirements'), opt(5, 'Continuously reassessed as relationships change')]),
    q('P6', PN.P6, ['mgr', 'officer'], 'Are security requirements written into OEM and vendor contracts as a condition of OT access?',
      [opt(1, 'No security clauses in contracts'), opt(2, 'Generic clauses, rarely enforced'), opt(3, 'Standard clauses for new contracts'), opt(4, 'Enforced with periodic vendor assessments'), opt(5, 'Contractually enforced with audit rights, regularly exercised')]),
    q('P6', PN.P6, ['officer'], "Do you verify a vendor's security posture and NACSA licensing before granting OT network access?",
      [opt(1, 'No verification before access is granted'), opt(2, 'Informal assurance only'), opt(3, 'Security questionnaire required before onboarding'), opt(4, 'Evidence-based verification, documented'), opt(5, 'Continuous vendor risk monitoring')]),

    q('P7', PN.P7, ['exec', 'mgr'], 'Have you implemented the IEC 62443 zones-and-conduits model to segment OT from IT?',
      [opt(1, 'Flat network, no segmentation'), opt(2, 'Some segmentation, inconsistently maintained'), opt(3, 'Zones and conduits defined for critical areas'), opt(4, 'Actively enforced and monitored'), opt(5, 'Fully mature zone architecture, continuously verified')]),
    q('P7', PN.P7, ['mgr', 'officer'], 'Does a Level 3.5 Industrial DMZ exist with a single named owner for the IT/OT boundary?',
      [opt(1, 'No DMZ - OT and IT directly connected'), opt(2, 'DMZ exists, ownership unclear or disputed'), opt(3, 'DMZ exists with documented but informal ownership'), opt(4, 'Named owner with defined patching and monitoring duties'), opt(5, 'Named owner, DMZ traffic actively monitored both directions')]),
    q('P7', PN.P7, ['officer'], 'Are legacy PLCs and SCADA systems that cannot be patched specifically compensated for?',
      [opt(1, 'No inventory of legacy systems'), opt(2, 'Known informally, no compensating controls'), opt(3, 'Documented with basic compensating controls'), opt(4, 'Actively monitored with layered controls'), opt(5, 'Formal risk-acceptance process, continuously reassessed')]),

    q('P8', PN.P8, ['exec', 'mgr'], 'Are default credentials reviewed on all newly commissioned OT equipment before it goes live?',
      [opt(1, 'Default credentials not reviewed'), opt(2, 'Reviewed informally, inconsistently'), opt(3, 'Standard practice before go-live'), opt(4, 'Enforced with a formal commissioning checklist'), opt(5, 'Automated verification before any equipment is activated')]),
    q('P8', PN.P8, ['mgr', 'officer'], 'Is vendor-supplied industrial software (SCADA/MES/HMI) tested for known vulnerabilities before deployment?',
      [opt(1, 'No security testing performed'), opt(2, 'Occasional testing, no fixed schedule'), opt(3, 'Testing required before major deployments'), opt(4, 'Regular testing plus ongoing vulnerability scanning'), opt(5, 'Continuous testing integrated into deployment process')]),
    q('P8', PN.P8, ['officer'], 'Is SCADA/MES/HMI configuration change control secured and logged?',
      [opt(1, 'No change control in place'), opt(2, 'Informal, undocumented changes'), opt(3, 'Documented change control process'), opt(4, 'Enforced with approval workflow'), opt(5, 'Fully logged and continuously audited')]),

    q('P9', PN.P9, ['exec', 'mgr'], 'Has leadership discussed lights-out/autonomous production as requiring more monitoring, not less?',
      [opt(1, 'Not discussed at leadership level'), opt(2, 'Aware but not yet addressed'), opt(3, 'Discussed and assigned to someone to monitor'), opt(4, 'Actively planning increased telemetry investment'), opt(5, 'Actively investing ahead of autonomy rollout')]),
    q('P9', PN.P9, ['mgr', 'officer'], 'Are automated contingency and fail-safe procedures defined for unmanned or minimally-manned production runs?',
      [opt(1, 'No automated contingency procedures'), opt(2, 'Informal, undocumented assumptions'), opt(3, 'Documented procedures for major failure modes'), opt(4, 'Tested procedures with defined response times'), opt(5, 'Proven automated response, continuously refined')]),
    q('P9', PN.P9, ['officer'], 'Is anyone tracking IIoT sensor proliferation and firmware supply-chain risk as connectivity expands?',
      [opt(1, 'No one tracking this risk'), opt(2, 'Informal awareness only'), opt(3, 'Someone assigned to monitor relevant advisories'), opt(4, 'Regular review cadence feeding into planning'), opt(5, 'Active research or pilot programme addressing emerging risk')])
  ];

  var QBANK = { fsi: QBANK_FSI, healthcare: QBANK_HEALTHCARE, government: QBANK_GOVERNMENT, manufacturing: QBANK_MANUFACTURING };
  var PILLAR_ORDER = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'];
  var CONTACT_URL = 'https://www.linkedin.com/in/minjuelee';

  var state = { sector: null, role: null, qset: [], idx: 0, answers: {} };

  function saveState() {
    try { localStorage.setItem('rice_assess_v2', JSON.stringify(state)); } catch (e) {}
  }
  function loadState() {
    try {
      var raw = localStorage.getItem('rice_assess_v2');
      if (raw) { var s = JSON.parse(raw); if (s && s.sector && s.role) return s; }
    } catch (e) {}
    return null;
  }

  var root = document.getElementById('assessApp');
  if (!root) return;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function render() {
    root.innerHTML = '';
    if (!state.sector) return renderSectorStep();
    if (!state.role) return renderRoleStep();
    if (state.idx < state.qset.length) return renderQuestion();
    return renderResults();
  }

  function renderSectorStep() {
    var wrap = el('div', 'asm-step');
    wrap.appendChild(el('div', 'asm-kicker', 'STEP 1 OF 3'));
    wrap.appendChild(el('h2', 'asm-h', 'Which sector are you assessing?'));
    wrap.appendChild(el('p', 'asm-sub', 'Every sector below has its own question set - the pillars are shared, but the language and controls asked about are specific to that sector.'));
    var grid = el('div', 'asm-grid4');
    SECTORS.forEach(function (s) {
      var card = el('button', 'asm-pick');
      var statusCls = s.status === 'live' ? 'asm-tag-live' : 'asm-tag-draft';
      card.innerHTML = '<span class="asm-tag ' + statusCls + '">' + s.statusLabel + '</span><b>' + s.label + '</b><span>' + s.full + '</span>';
      card.addEventListener('click', function () { state.sector = s.id; saveState(); render(); });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);

    var note = el('div', 'asm-devnote');
    note.innerHTML = '<p><b>Healthcare, Government, and Manufacturing are marked "9/9 pillars drafted"</b> - every pillar has a full objective set, but none of it is validated against real-world engagement yet. Treat results for those sectors as a useful starting conversation, not a finished benchmark. FSI is the one fully live, field-tested edition.</p>';
    wrap.appendChild(note);

    var missing = el('div', 'asm-missing');
    missing.innerHTML = "<p>Don't see your sector - Education, Media, Transport, Energy, or something else entirely?</p>";
    var missBtn = el('a', 'btn btn-line', 'Tell us what you need \u2192');
    missBtn.href = CONTACT_URL; missBtn.target = '_blank'; missBtn.rel = 'noopener';
    missing.appendChild(missBtn);
    wrap.appendChild(missing);

    root.appendChild(wrap);
  }

  function renderRoleStep() {
    var wrap = el('div', 'asm-step');
    wrap.appendChild(el('div', 'asm-kicker', 'STEP 2 OF 3'));
    wrap.appendChild(el('h2', 'asm-h', "What's your role?"));
    wrap.appendChild(el('p', 'asm-sub', "You'll see a question set tailored to what you're actually positioned to assess."));
    var bank = QBANK[state.sector];
    var grid = el('div', 'asm-grid3');
    ROLES.forEach(function (r) {
      var card = el('button', 'asm-pick asm-pick-role');
      var count = bank.filter(function (qq) { return qq.roles.indexOf(r.id) !== -1; }).length;
      card.innerHTML = '<b>' + r.label + '</b><span>' + r.desc + '</span><span class="asm-count">' + count + ' questions \u00b7 ~' + Math.max(5, Math.round(count * 0.7)) + ' min</span>';
      card.addEventListener('click', function () {
        state.role = r.id;
        state.qset = bank.filter(function (qq) { return qq.roles.indexOf(r.id) !== -1; });
        state.idx = 0; state.answers = {};
        saveState(); render();
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    var back = el('button', 'asm-back', '\u2190 Change sector');
    back.addEventListener('click', function () { state.sector = null; saveState(); render(); });
    wrap.appendChild(back);
    root.appendChild(wrap);
  }

  function renderQuestion() {
    var qq = state.qset[state.idx];
    var wrap = el('div', 'asm-step');
    var pct = Math.round((state.idx / state.qset.length) * 100);
    var bar = el('div', 'asm-progress');
    bar.innerHTML = '<span style="width:' + pct + '%"></span>';
    wrap.appendChild(bar);
    wrap.appendChild(el('div', 'asm-kicker', 'QUESTION ' + (state.idx + 1) + ' OF ' + state.qset.length + ' \u00b7 ' + qq.pillar + ' - ' + qq.pillarName.toUpperCase()));
    wrap.appendChild(el('h2', 'asm-h asm-qtext', qq.text));
    var opts = el('div', 'asm-opts');
    qq.options.forEach(function (o) {
      var b = el('button', 'asm-opt');
      b.innerHTML = '<span class="asm-lv">L' + o.L + '</span><span class="asm-otext">' + o.text + '</span>';
      b.addEventListener('click', function () {
        state.answers[qq.pillar] = state.answers[qq.pillar] || [];
        state.answers[qq.pillar].push(o.L);
        state.idx++;
        saveState(); render();
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);

    var back = el('button', 'asm-back asm-back-btn', state.idx === 0 ? '\u2190 Back to role selection' : '\u2190 Previous question');
    back.addEventListener('click', function () {
      if (state.idx === 0) { state.role = null; saveState(); render(); return; }
      state.idx--;
      var prevPillar = state.qset[state.idx].pillar;
      if (state.answers[prevPillar] && state.answers[prevPillar].length) state.answers[prevPillar].pop();
      saveState(); render();
    });
    wrap.appendChild(back);
    root.appendChild(wrap);
  }

  function pillarScore(pid) {
    var arr = state.answers[pid];
    if (!arr || !arr.length) return 0;
    return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
  }

  function renderResults() {
    var scores = {};
    PILLAR_ORDER.forEach(function (p) { scores[p] = pillarScore(p); });
    var overall = PILLAR_ORDER.reduce(function (a, p) { return a + scores[p]; }, 0) / PILLAR_ORDER.length;
    var weakest = PILLAR_ORDER.reduce(function (a, b) { return scores[a] <= scores[b] ? a : b; });
    var pillarNames = {};
    QBANK[state.sector].forEach(function (qq) { pillarNames[qq.pillar] = qq.pillarName; });

    var wrap = el('div', 'asm-step asm-results');
    wrap.appendChild(el('div', 'asm-kicker', 'YOUR RESULTS'));
    var lv = Math.max(1, Math.round(overall));
    wrap.appendChild(el('h2', 'asm-h', 'Overall: L' + lv + ' - ' + LADDER[lv].name));
    wrap.appendChild(el('p', 'asm-sub', LADDER[lv].blurb + ' This reflects a ' + ROLES.filter(function (r) { return r.id === state.role; })[0].label.toLowerCase() + "'s view - pair it with other roles' results for the full picture."));

    var canvasWrap = el('div', 'asm-radar-wrap');
    var canvas = document.createElement('canvas');
    canvas.className = 'asm-radar'; canvas.width = 640; canvas.height = 640;
    canvasWrap.appendChild(canvas);
    wrap.appendChild(canvasWrap);

    var startHere = el('div', 'asm-starthere');
    startHere.innerHTML = '<span class="lbl">WHERE TO START</span><h3>' + weakest + ' - ' + pillarNames[weakest] + '</h3><p>Scored lowest of the nine - L' + Math.max(1, Math.round(scores[weakest])) + ' (' + LADDER[Math.max(1, Math.round(scores[weakest]))].name + '). This is the highest-leverage place to focus first.</p>';
    wrap.appendChild(startHere);

    var breakdown = el('div', 'asm-breakdown');
    PILLAR_ORDER.forEach(function (p) {
      var s = scores[p]; var rlv = Math.max(1, Math.round(s));
      var row = el('div', 'asm-brow');
      row.innerHTML = '<span class="asm-bp">' + p + '</span><span class="asm-bn">' + pillarNames[p] + '</span>' +
        '<span class="asm-bbar"><span style="width:' + (s / 5 * 100) + '%"></span></span>' +
        '<span class="asm-blv">L' + rlv + ' ' + LADDER[rlv].name + '</span>';
      breakdown.appendChild(row);
    });
    wrap.appendChild(breakdown);

    var sector = SECTORS.filter(function (s) { return s.id === state.sector; })[0];
    var cta = el('div', 'asm-cta');
    var ctaText = sector.status === 'draft'
      ? 'This is a self-read, not an audit - and this sector is still in draft. Treat it as a conversation starter, not a certification.'
      : 'This is a self-read, not an audit - treat it as a conversation starter, not a certification.';
    cta.innerHTML = '<p>' + ctaText + '</p>';
    var ctaBtn = el('a', 'btn btn-solid', 'View the ' + sector.label + ' framework \u2192');
    ctaBtn.href = sector.href;
    cta.appendChild(ctaBtn);
    var retake = el('button', 'btn btn-line', 'Retake assessment');
    retake.addEventListener('click', function () {
      state = { sector: null, role: null, qset: [], idx: 0, answers: {} };
      saveState(); render();
    });
    cta.appendChild(retake);
    wrap.appendChild(cta);

    root.appendChild(wrap);
    drawRadar(canvas, scores, PILLAR_ORDER);
  }

  function drawRadar(canvas, scores, order) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = canvas.clientWidth || 480;
    canvas.width = size * dpr; canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cx = size / 2, cy = size / 2, R = size * 0.36;
    var n = order.length;
    ctx.clearRect(0, 0, size, size);

    for (var ring = 1; ring <= 5; ring++) {
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var a = (Math.PI * 2 * (i % n)) / n - Math.PI / 2;
        var r = R * (ring / 5);
        var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,' + (ring === 5 ? 0.14 : 0.06) + ')';
      ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.font = '11px "Grandview Display", sans-serif';
    ctx.fillStyle = 'rgba(233,231,224,.55)';
    for (i = 0; i < n; i++) {
      a = (Math.PI * 2 * i) / n - Math.PI / 2;
      x = cx + Math.cos(a) * R; y = cy + Math.sin(a) * R;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.stroke();
      var lx = cx + Math.cos(a) * (R + 22), ly = cy + Math.sin(a) * (R + 22);
      ctx.textAlign = Math.cos(a) > 0.3 ? 'left' : Math.cos(a) < -0.3 ? 'right' : 'center';
      ctx.fillText(order[i], lx, ly + 4);
    }
    ctx.beginPath();
    for (i = 0; i <= n; i++) {
      a = (Math.PI * 2 * (i % n)) / n - Math.PI / 2;
      var val = Math.max(scores[order[i % n]], 0.15);
      r = R * (val / 5);
      x = cx + Math.cos(a) * r; y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(201,168,76,.16)';
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
    for (i = 0; i < n; i++) {
      a = (Math.PI * 2 * i) / n - Math.PI / 2;
      val = Math.max(scores[order[i]], 0.15);
      r = R * (val / 5);
      x = cx + Math.cos(a) * r; y = cy + Math.sin(a) * r;
      ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#E8CE84'; ctx.fill();
    }
  }

  var saved = loadState();
  if (saved && QBANK[saved.sector]) state = saved;
  render();
  window.addEventListener('resize', function () {
    var c = root.querySelector('.asm-radar');
    if (c) { var scores = {}; PILLAR_ORDER.forEach(function (p) { scores[p] = pillarScore(p); }); drawRadar(c, scores, PILLAR_ORDER); }
  });
})();
