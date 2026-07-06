# database/models.py — SQLAlchemy ORM models

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class SignalType(enum.Enum):
    TENDER              = 'tender'
    FUNDING             = 'funding'
    HIRING              = 'hiring'
    NEW_REGISTRATION    = 'new_registration'
    WEBSITE_CHANGE      = 'website_change'
    REVIEW_DROP         = 'review_drop'
    COMMUNITY_INTENT    = 'community_intent'
    EXPANSION           = 'expansion'
    EXECUTIVE_HIRE      = 'executive_hire'
    TECH_MIGRATION      = 'tech_migration'
    SEARCH_INTENT       = 'search_intent'
    NEWS                = 'news'
    GBP_NEW_LISTING     = 'gbp_new_listing'

class UrgencyTier(enum.Enum):
    COLD      = 'cold'
    WARM      = 'warm'
    HIGH      = 'high'
    IMMEDIATE = 'immediate'


class Company(Base):
    __tablename__ = 'companies'
    id                  = Column(String, primary_key=True)  # Normalised slug
    name                = Column(String, nullable=False)
    domain              = Column(String)
    industry            = Column(String)
    country             = Column(String)
    city                = Column(String)
    employee_estimate   = Column(Integer)
    revenue_estimate    = Column(Float)
    founded_year        = Column(Integer)
    tech_stack          = Column(JSON)   # List of detected technologies
    decision_makers     = Column(JSON)   # List of {name, role, linkedin}
    latest_intent_score = Column(Integer, default=0)
    latest_icp_score    = Column(Integer, default=0)
    deal_readiness      = Column(Integer, default=0)
    urgency_tier        = Column(SqlEnum(UrgencyTier))
    outreach_sent       = Column(Boolean, default=False)
    outreach_sent_at    = Column(DateTime)
    crm_synced          = Column(Boolean, default=False)
    notes               = Column(Text)
    created_at          = Column(DateTime, default=datetime.utcnow)
    updated_at          = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    signals             = relationship('Signal', back_populates='company')
    outreach_drafts     = relationship('OutreachDraft', back_populates='company')


class Signal(Base):
    __tablename__ = 'signals'
    id              = Column(Integer, primary_key=True, autoincrement=True)
    company_id      = Column(String, ForeignKey('companies.id'))
    signal_type     = Column(SqlEnum(SignalType), nullable=False)
    raw_text        = Column(Text)    # Original scraped content
    extracted_data  = Column(JSON)    # LLM-extracted structured data
    source_url      = Column(String)
    source_name     = Column(String)
    score_weight    = Column(Integer)
    confidence      = Column(Float)   # LLM confidence 0.0-1.0
    signal_date     = Column(DateTime)  # When signal occurred
    detected_at     = Column(DateTime, default=datetime.utcnow)
    decayed_weight  = Column(Integer)   # Weight after time decay
    company         = relationship('Company', back_populates='signals')


class OutreachDraft(Base):
    __tablename__ = 'outreach_drafts'
    id              = Column(Integer, primary_key=True, autoincrement=True)
    company_id      = Column(String, ForeignKey('companies.id'))
    email_subject   = Column(String)
    email_body      = Column(Text)
    linkedin_message= Column(Text)
    cold_call_opener= Column(Text)
    signal_citations= Column(JSON)    # Which signals informed this
    generated_at    = Column(DateTime, default=datetime.utcnow)
    approved        = Column(Boolean, default=False)
    sent            = Column(Boolean, default=False)
    company         = relationship('Company', back_populates='outreach_drafts')


class WebsiteSnapshot(Base):
    __tablename__ = 'website_snapshots'
    id              = Column(Integer, primary_key=True, autoincrement=True)
    company_id      = Column(String, ForeignKey('companies.id'))
    url             = Column(String)
    content_hash    = Column(String)  # MD5 of page content
    content         = Column(Text)
    snapshot_date   = Column(DateTime, default=datetime.utcnow)
    changes_detected= Column(Boolean, default=False)
    change_summary  = Column(Text)    # LLM summary of what changed


class HuntingRun(Base):
    __tablename__ = 'hunting_runs'
    id              = Column(Integer, primary_key=True, autoincrement=True)
    run_type        = Column(String)  # 'morning_hunt', 'community_scan', etc
    started_at      = Column(DateTime, default=datetime.utcnow)
    completed_at    = Column(DateTime)
    signals_found   = Column(Integer, default=0)
    companies_found = Column(Integer, default=0)
    leads_qualified = Column(Integer, default=0)
    errors          = Column(JSON)
    status          = Column(String)  # 'running', 'completed', 'failed'
