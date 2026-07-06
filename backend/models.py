from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class CompanyModel(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    domain = Column(String, unique=True, index=True)
    industry = Column(String)
    revenue = Column(String)
    headcount = Column(Integer)
    intent_score = Column(Float, default=0.0)
    classification = Column(String, default="Cold")
    
    # NEW IN V3.1
    win_probability = Column(Float, default=10.0)
    icp_grade = Column(String, default="C")
    
    risk_summary = Column(Text, nullable=True)
    opp_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    signals = relationship("SignalModel", back_populates="company", cascade="all, delete-orphan")
    committee = relationship("CommitteeMemberModel", back_populates="company", cascade="all, delete-orphan")

class SignalModel(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    signal_type = Column(String, index=True)
    source = Column(String)
    weight = Column(Integer)
    description = Column(Text)
    evidence = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("CompanyModel", back_populates="signals")

class CommitteeMemberModel(Base):
    __tablename__ = "committee_members"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    name = Column(String)
    role = Column(String)  # Economic Buyer, Champion, User, Blocker
    title = Column(String)
    influence = Column(String)  # High, Medium, Low, Negative
    status = Column(String)  # Engaged, Contacted, Unreached, Blocked
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("CompanyModel", back_populates="committee")

class AgentLogModel(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, index=True)
    agent_name = Column(String)
    log_type = Column(String, default="info")
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
