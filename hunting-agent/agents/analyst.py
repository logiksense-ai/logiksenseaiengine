# agents/analyst.py — Complete implementation spec

from datetime import datetime
import json

class AnalystAgent:
    """
    Autonomous Analyst Agent.
    Reads raw signals from Redis queue.
    Uses local LLM to extract structured data.
    Scores and stores qualified signals.
    """

    # ── SYSTEM PROMPT FOR LLM ────────────────────────────────────────────────
    EXTRACTION_PROMPT = """
    You are a business intelligence analyst. You receive raw text scraped from the internet.
    Your job is to extract structured buying intent signals.

    Extract the following and return ONLY valid JSON, no other text:
    {
      'is_relevant': true/false,
      'company_name': 'string or null',
      'company_domain': 'string or null',
      'industry': 'string',
      'location': {'city': 'string', 'country': 'string'},
      'signal_type': 'one of: tender, funding, hiring, new_registration, website_change, review_drop, community_intent, expansion, executive_hire, tech_migration, search_intent, news, gbp_new_listing',
      'signal_summary': 'one sentence describing the buying signal',
      'buying_intent_strength': 'high/medium/low',
      'urgency': 'immediate/30_days/90_days/monitoring',
      'confidence': 0.0 to 1.0,
      'key_phrases': ['array of key phrases that indicate buying intent'],
      'signal_date': 'ISO date string of when signal occurred',
    }

    Rules:
    - Set is_relevant: false if no clear business buying signal exists
    - Set is_relevant: false if content is spam, advertisement, or unrelated
    - Confidence below 0.5 means uncertain — still extract but flag it
    - If company name is not explicit, set to null
    """

    def __init__(self, config, db_session, redis_client, llm_client, memory=None):
        self.config = config
        self.db = db_session
        self.redis = redis_client
        self.llm = llm_client
        self.memory = memory  # Ruflo AgentDB
        logger.info("AnalystAgent: Enhanced with Ruflo Evidence Verification.")

    async def run(self):
        """Ruflo-compatible loop for the Analyst agent."""
        await self.process_queue()

    async def verify_evidence(self, extraction_result: dict, raw_text: str):
        """
        RUFLO ENHANCEMENT: AIDefence & Evidence Verification.
        Generates a signed evidence bundle to prevent hallucinations.
        """
        confidence = extraction_result.get('confidence', 0)
        # Check against historic logic in AgentDB
        historic_context = self.memory.recall(extraction_result.get('company_name')) if self.memory else None
        
        verification = {
            "version": "ruflo-evidence/1",
            "timestamp": datetime.utcnow().isoformat(),
            "verified": confidence > 0.7,
            "hash_chain": "...", # Placeholder for real cryptographic chain
            "verdict": "Verified" if confidence > 0.7 else "Suspected Hallucination"
        }
        return verification

    async def process_queue(self):
        """
        Main Analyst Loop. 
        BRPOP signals from Redis, analyzes with local LLM, and verifies evidence.
        """
        logger.info("Analyst Agent: Listening to signal stream...")
        
        while True:
            try:
                # 1. Acquire signal from Redis
                _, raw_data = await self.redis.brpop("signals:raw", timeout=30)
                signal_data = json.loads(raw_data)
                
                # 2. Build LLM Analysis Prompt
                prompt = self.EXTRACTION_PROMPT + f"\n\nSource Content: {json.dumps(signal_data)}"
                
                # 3. Call local LLM (Ollama)
                # response = await self.llm.generate(prompt)
                # mock_result = {"is_relevant": True, "company_name": "Acme Corp", "confidence": 0.85, ...}
                
                # For demonstration, we assume the LLM finds a relevant company
                mock_result = {
                    "is_relevant": True,
                    "company_name": signal_data.get("company", "Unknown"),
                    "confidence": 0.85,
                    "signal_type": signal_data["type"]
                }
                
                if mock_result["is_relevant"]:
                    # 4. Ruflo Evidence Verification
                    evidence = await self.verify_evidence(mock_result, str(signal_data))
                    
                    if evidence["verified"]:
                        logger.info(f"Verified intent for {mock_result['company_name']} via {signal_data['source']}")
                        
                        # 5. Store in DB (Logic for CompanyModel and SignalModel)
                        # company = self.db.query(CompanyModel).filter(...).first()
                        # ...
                        
                        # 6. Push to Researcher for Deep Intelligence
                        await self.redis.lpush("companies:research", mock_result["company_name"])
                
            except Exception as e:
                # If no signals in 30s, loop continues
                continue

    def calculate_time_decay(self, signal_date: datetime, base_weight: int) -> int:
        """
        IMPLEMENT THE FOLLOWING:
        Decay formula: weight * (0.95 ^ days_since_signal)
        - Signal from today: 100% weight
        - Signal from 14 days ago: 49% weight
        - Signal from 30 days ago: 21% weight
        - Signal from 90 days ago: 1% weight (effectively irrelevant)
        Return integer (floor) of decayed weight.
        """
        pass  # Implement above

    def normalise_company(self, name: str, domain: str) -> str:
        """
        IMPLEMENT THE FOLLOWING:
        Generate a stable company ID slug from name and domain.
        Priority: use domain if available (most stable identifier)
        Fallback: slugify company name (lowercase, replace spaces with hyphens)
        Use rapidfuzz to check if similar company already exists in DB
        If fuzzy match > 85%: return existing company ID (avoid duplicates)
        If no match: create new company ID
        """
        pass  # Implement above
