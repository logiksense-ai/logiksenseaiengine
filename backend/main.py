from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import engine, get_db, Base
from models import CompanyModel, SignalModel, AgentLogModel, ScraperProfileModel, ScraperJobModel

# Initialize database schemas automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LogikSense AI Engine",
    description="Enterprise-grade autonomous buying intent detection & AI agent orchestration.",
    version="3.0.0 (Production)"
)

# Enable CORS for frontend dashboard on Render/local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Render URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Request / Response validation
class SignalCreate(BaseModel):
    company_id: int
    signal_type: str
    source: str
    weight: int
    description: str
    evidence: str

class CompanyCreate(BaseModel):
    name: str
    domain: str
    industry: str
    revenue: Optional[str] = "$10M - $25M"
    headcount: Optional[int] = 50

class ScraperProfileCreate(BaseModel):
    name: str
    business_type: str
    city: Optional[str] = None
    country: Optional[str] = None
    target_limit: Optional[int] = 10

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "LogikSense AI Engine",
        "version": "3.0.0"
    }

@app.get("/api/companies")
def get_companies(db: Session = Depends(get_db)):
    companies = db.query(CompanyModel).all()
    result = []
    for c in companies:
        result.append({
            "id": str(c.id),
            "name": c.name,
            "domain": c.domain,
            "industry": c.industry,
            "revenue": c.revenue,
            "headcount": c.headcount,
            "intentScore": c.intent_score,
            "classification": c.classification,
            "riskSummary": c.risk_summary or "Standard operating posture.",
            "oppSummary": c.opp_summary or "Active growth monitoring.",
            "signals": [
                {
                    "id": str(s.id),
                    "type": s.signal_type,
                    "source": s.source,
                    "timestamp": s.created_at.isoformat(),
                    "weight": s.weight,
                    "description": s.description,
                    "evidence": s.evidence
                } for s in c.signals
            ],
            "techStack": [],
            "jobs": [],
            "webDiffs": []
        })
    return result

@app.post("/api/companies")
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    existing = db.query(CompanyModel).filter(CompanyModel.domain == company.domain).first()
    if existing:
        raise HTTPException(status_code=400, detail="Company domain already registered.")
    
    new_company = CompanyModel(
        name=company.name,
        domain=company.domain,
        industry=company.industry,
        revenue=company.revenue,
        headcount=company.headcount
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

# ── Scraper Endpoints ────────────────────────────────────────

@app.get("/api/scraper/profiles")
def list_profiles(db: Session = Depends(get_db)):
    profiles = db.query(ScraperProfileModel).order_by(ScraperProfileModel.updated_at.desc()).all()
    return profiles

@app.post("/api/scraper/profiles")
def create_profile(profile: ScraperProfileCreate, db: Session = Depends(get_db)):
    query = f"{profile.business_type} in {profile.city or ''} {profile.country or ''}".strip()
    new_profile = ScraperProfileModel(
        name=profile.name,
        business_type=profile.business_type,
        city=profile.city,
        country=profile.country,
        query=query,
        target_limit=profile.target_limit
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.get("/api/scraper/status")
def get_scraper_status():
    return {
        "active_jobs": 0,
        "completed_today": 5,
        "system_load": "low",
        "next_scheduled": datetime.utcnow().isoformat()
    }

@app.post("/api/scraper/profiles/{profile_id}/run")
def run_scraper(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(ScraperProfileModel).filter(ScraperProfileModel.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # In a real app, this would trigger a Celery task
    new_job = ScraperJobModel(
        profile_id=profile_id,
        status="running"
    )
    db.add(new_job)
    db.commit()
    
    # Mock behavior: log it
    print(f"Triggered scraper for profile: {profile.name} with query: {profile.query}")
    
    return {"job_id": new_job.id, "status": "started"}

# ── Audit Log Endpoints ──────────────────────────────────────

@app.get("/api/audit/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    # Reusing AgentLogModel for simplicity in this port
    logs = db.query(AgentLogModel).order_by(AgentLogModel.timestamp.desc()).limit(100).all()
    return logs
    db.refresh(new_company)
    return {"status": "success", "id": new_company.id}

@app.post("/api/signals")
def add_signal(signal: SignalCreate, db: Session = Depends(get_db)):
    company = db.query(CompanyModel).filter(CompanyModel.id == signal.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")
    
    new_signal = SignalModel(
        company_id=signal.company_id,
        signal_type=signal.signal_type,
        source=signal.source,
        weight=signal.weight,
        description=signal.description,
        evidence=signal.evidence
    )
    db.add(new_signal)
    
    # Recalculate intent score on new signal
    company.intent_score = min(100.0, company.intent_score + signal.weight)
    if company.intent_score >= 81:
        company.classification = "Immediate Opportunity"
    elif company.intent_score >= 61:
        company.classification = "High Intent"
    elif company.intent_score >= 31:
        company.classification = "Warm"
        
    db.commit()
    return {"status": "success", "new_score": company.intent_score}

@app.get("/api/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(AgentLogModel).order_by(AgentLogModel.timestamp.desc()).limit(50).all()
    return [
        {
            "timestamp": l.timestamp.strftime("%H:%M:%S"),
            "agentId": l.agent_id,
            "type": l.log_type,
            "message": l.message
        } for l in logs
    ]


# ── Live Trends Endpoint ───────────────────────────────────

@app.get("/api/trends")
def get_trends():
    from trends_api import get_live_search_trends
    return get_live_search_trends()

# ── Live Research Endpoint (REAL DATA) ─────────────────────

class ResearchRequest(BaseModel):
    query: str

@app.post("/api/research")
def run_research(req: ResearchRequest):
    """
    Runs the full real-data research pipeline.
    Every data point is fetched live from the internet.
    No mock data. No fabricated values.
    """
    from research import run_full_research
    
    if not req.query or len(req.query.strip()) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters.")
    
    results = run_full_research(req.query.strip())
    return results

# ── Marketing Execution Endpoint (SyncBridge) ────────────────

class PromoteLeadRequest(BaseModel):
    lead_id: str
    company_data: dict
    signal_data: dict

@app.post("/api/marketing/promote")
async def promote_lead(req: PromoteLeadRequest):
    """
    Interfaces with the LogikSense Marketing modules to promote a hunted lead
    into an active outreach campaign.
    """
    from modules.marketing.sync_bridge import SyncBridge
    bridge = SyncBridge()
    result = await bridge.promote_lead_to_campaign(
        req.lead_id, 
        req.company_data, 
        req.signal_data
    )
    return result
