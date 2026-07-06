# config.py — Complete configuration for the Autonomous Hunting Agent

from dataclasses import dataclass, field
from typing import List, Dict

# ── HUNTING SCHEDULE ──────────────────────────────────────────────────────────
SCHEDULE = {
    'morning_hunt':    '06:00',   # Business register + tender scan
    'signal_process':  '09:00',   # LLM analysis of overnight data
    'community_scan':  '11:00',   # Reddit, forums, public groups
    'deep_research':   '14:00',   # Company deep-dives for top scorers
    'daily_brief':     '17:00',   # Compile and send daily brief
    'website_diff':    '03:00',   # Overnight website change detection
}

# ── IDEAL CUSTOMER PROFILE (ICP) ────────────────────────────────────────────
ICP = {
    'industries': [
        'accounting', 'bookkeeping', 'finance',
        'allied health', 'physiotherapy', 'psychology',
        'construction', 'trades', 'building',
        'legal', 'law firm', 'solicitor',
        'real estate', 'property management',
        'retail', 'hospitality', 'restaurant',
    ],
    'exclude_industries': ['gambling', 'tobacco', 'weapons'],
    'employee_range': (1, 200),           # Min and max employees
    'business_age_max_years': 5,           # Max age for SMB targeting
    'revenue_range_aud': (100000, 10000000),
    'geographies': ['Australia', 'United Kingdom', 'New Zealand'],
    'cities_priority': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'London'],
}

# ── SERVICES WE SELL ─────────────────────────────────────────────────────────
OUR_SERVICES = [
    'AI automation', 'workflow automation', 'AI chatbots',
    'AI voice agents', 'custom software development',
    'business process automation', 'CRM integration',
]

# ── ALERT THRESHOLDS ──────────────────────────────────────────────────────────
THRESHOLDS = {
    'minimum_score_to_research': 50,
    'minimum_score_to_outreach': 70,
    'immediate_alert_score':     85,   # Triggers instant Slack ping
    'convergence_signals_needed': 3,   # Signals needed for bull's eye alert
    'convergence_window_days':   30,
}

# ── SIGNAL SCORING WEIGHTS ────────────────────────────────────────────────────
SIGNAL_WEIGHTS = {
    'tender_published':          35,
    'funding_announced':         28,
    'search_intent_spike':       25,
    'technology_migration':      22,
    'relevant_hire':             20,
    'new_business_registration': 20,
    'expansion_detected':        18,
    'community_buying_intent':   18,
    'executive_appointment':     15,
    'news_coverage':             15,
    'review_score_drop':         12,
    'website_changed':           10,
    'gbp_new_listing':           10,
    'forum_intent_phrase':       10,
    'social_proof_gap':           8,
}

# ── HUNTING SOURCES ───────────────────────────────────────────────────────────
SOURCES = {
    'business_registers': {
        'ABR_Australia': 'https://data.gov.au/data/api/action/datastore_search',
        'Companies_House_UK': 'https://api.company-information.service.gov.uk',
        'OpenCorporates': 'https://api.opencorporates.com/v0.4/companies/search',
    },
    'job_boards': {
        'seek': 'https://www.seek.com.au',
        'indeed': 'https://au.indeed.com',
        'linkedin_jobs': 'https://www.linkedin.com/jobs/search',
    },
    'tender_boards': {
        'austender': 'https://www.tenders.gov.au',
        'procurepoint': 'https://www.procurepoint.nsw.gov.au',
        'sam_gov': 'https://sam.gov/api/prod/opportunities/v2/search',
    },
    'community': {
        'reddit_subreddits': [
            'r/aussmallbusiness', 'r/smallbusiness', 'r/entrepreneur',
            'r/accounting', 'r/legaladvice', 'r/Australia',
        ],
        'quora_topics': ['small business software', 'accounting software Australia'],
    },
    'news_rss': [
        'https://www.afr.com/rss',
        'https://www.smartcompany.com.au/feed',
        'https://feeds.feedburner.com/TechCrunch',
    ],
    'review_platforms': ['google_business', 'g2', 'capterra', 'trustpilot'],
}

# ── LLM CONFIGURATION ─────────────────────────────────────────────────────────
LLM = {
    'provider': 'ollama',            # 'ollama' or 'openai'
    'model': 'mistral:7b',           # or 'llama3:8b' or 'gemma2:9b'
    'base_url': 'http://localhost:11434',
    'temperature': 0.1,              # Low temp for consistent extraction
    'max_tokens': 2000,
}

# ── NOTIFICATION SETTINGS ─────────────────────────────────────────────────────
NOTIFICATIONS = {
    'slack_webhook': '',             # Set in .env
    'email_to': '',                  # Set in .env
    'n8n_webhook': 'http://localhost:5678/webhook/daily-brief',
    'immediate_alert_channel': '#intent-alerts',
}

# ── RATE LIMITING ─────────────────────────────────────────────────────────────
RATE_LIMITS = {
    'default_delay_seconds': 3,
    'seek_com_au': 5,
    'linkedin_com': 8,
    'google_com': 4,
    'reddit_com': 2,       # PRAW handles this automatically
}
