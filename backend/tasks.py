from celery_app import celery_app
from database import SessionLocal
from models import CompanyModel, SignalModel, AgentLogModel, CommitteeMemberModel
from datetime import datetime

# Intent Scoring Weights according to Master Prompt Version 3 (Section 7)
SIGNAL_WEIGHTS = {
    "Government Tender Match": 35,
    "Funding Announcement": 28,
    "Search Intent Spike": 25,
    "Technology Migration Signal": 22,
    "Active Hiring": 20,
    "New Business Registration (< 6 months)": 20,
    "Expansion / New Office": 18,
    "Hyper-Local Buying Intent Phrase": 18,
    "Executive Appointment": 15,
    "News Coverage": 15,
    "Review Score Drop": 12,
    "Website Change Detected": 10,
    "Google Business Profile New Listing": 10,
    "Public Conversation Intent": 10,
    "Social Proof Gap": 8
}

@celery_app.task
def run_deal_qualification_agent(company_id: int):
    """Agent 16: Deal Qualification & Win Probability Engine (v3.1 MEDDPICC)"""
    db = SessionLocal()
    try:
        company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
        if not company:
            return {"status": "error", "message": "Company not found"}

        # Base win probability starts at 10%
        base_probability = 10.0
        
        # Check committee mapping members (Economic Buyer, Champion)
        has_eb = db.query(CommitteeMemberModel).filter(
            CommitteeMemberModel.company_id == company_id,
            CommitteeMemberModel.role == "Economic Buyer",
            CommitteeMemberModel.status == "Engaged"
        ).first() is not None
        
        has_champion = db.query(CommitteeMemberModel).filter(
            CommitteeMemberModel.company_id == company_id,
            CommitteeMemberModel.role == "Champion",
            CommitteeMemberModel.status == "Engaged"
        ).first() is not None
        
        # Check specific intent signals for Pain / Metrics
        has_pain = db.query(SignalModel).filter(
            SignalModel.company_id == company_id,
            SignalModel.signal_type.in_(["Government Tender Match", "Search Intent Spike"])
        ).first() is not None

        if has_eb:
            base_probability += 20.0  # +20% Economic Buyer
        if has_champion:
            base_probability += 10.0  # +10% Champion
        if has_pain:
            base_probability += 15.0  # +15% Identify Pain

        # Save to database
        company.win_probability = min(100.0, base_probability)
        db.commit()

        log = AgentLogModel(
            agent_id=16,
            agent_name="Deal Qualification Engine",
            log_type="success",
            message=f"Audited win probability for {company.name}: {company.win_probability}%"
        )
        db.add(log)
        db.commit()
        return {"status": "success", "win_probability": company.win_probability}
    finally:
        db.close()
