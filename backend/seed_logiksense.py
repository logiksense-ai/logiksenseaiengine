from database import SessionLocal, engine
import models
from datetime import datetime

def seed_data():
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.EmailTemplateModel).first():
            print("Database already contains LogikSense data.")
            return

        # 1. Seed Email Templates
        templates = [
            models.EmailTemplateModel(
                name="Cold Intro — Intent Based",
                subject="Question about {{company_name}} expansion",
                body="Hi {{first_name}},\n\nI noticed {{company_name}} is scaling your operations in {{city}}. We've helped similar companies streamline their logistics during growth phases.\n\nWould you be open to a 10-minute chat next week?\n\nBest,\nLogikSense AI",
                category="Outreach"
            ),
            models.EmailTemplateModel(
                name="Follow-up — Social Proof",
                subject="Case study for {{company_name}}",
                body="Hi {{first_name}},\n\nThought you might find this interesting. We recently helped a company in the {{industry}} sector achieve 30% efficiency gains.\n\nBest,\nLogikSense AI",
                category="Follow-up"
            )
        ]
        db.add_all(templates)
        db.commit()

        # 2. Seed Sequences
        sequence = models.EmailSequenceModel(
            name="Enterprise Velocity Sequence",
            description="3-step high-touch sequence for Tier 1 leads."
        )
        db.add(sequence)
        db.commit()
        db.refresh(sequence)

        # 3. Seed Sequence Steps
        steps = [
            models.EmailSequenceStepModel(sequence_id=sequence.id, template_id=templates[0].id, step_number=1, delay_days=0),
            models.EmailSequenceStepModel(sequence_id=sequence.id, template_id=templates[1].id, step_number=2, delay_days=3),
        ]
        db.add_all(steps)

        # 4. Seed LinkedIn Campaign
        li_campaign = models.LinkedInCampaignModel(
            name="CXO Connection Blitz",
            status="active",
            connection_message="Hi {{first_name}}, I'm following your work at {{company_name}} and would love to connect.",
            target_count=50
        )
        db.add(li_campaign)

        # 5. Seed initial Leads
        leads = [
            models.LeadModel(
                first_name="David", last_name="Miller", email="dmiller@fast-logistics.net",
                company_name="Fast Logistics", job_title="CEO", status="contacted", lead_score=92
            ),
            models.LeadModel(
                first_name="Samantha", last_name="Reed", email="sreed@innovate-corp.com",
                company_name="Innovate Corp", job_title="Director of IT", status="new", lead_score=84
            )
        ]
        db.add_all(leads)

        db.commit()
        print("LogikSense seed data injected successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()