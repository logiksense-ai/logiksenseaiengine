# agents/writer.py — Complete implementation spec

class WriterAgent:

    EMAIL_PROMPT = """
    You are a senior B2B sales consultant writing a cold email.
    You must write a highly personalised email that references specific public signals.
    Never write generic emails. Every sentence must be relevant to this specific company.

    Rules:
    - Subject line: 6-8 words. Reference a specific signal or company fact.
    - Opening line: Reference ONE specific public signal the recipient would recognise.
    - Do NOT mention how you found the information — just reference the fact.
    - Body: 3-4 short paragraphs. Max 150 words total.
    - No buzzwords: no 'synergy', 'leverage', 'solutions', 'touch base'.
    - CTA: One specific ask. Prefer: 'free 30-minute audit' or 'quick call this week'.
    - Tone: Conversational, direct, peer-to-peer. Not salesy.

    Return ONLY valid JSON:
    {
      'subject': 'email subject line',
      'body': 'full email body with line breaks as \\n',
      'signal_citations': ['list of signals used in this email'],
    }
    """

    LINKEDIN_PROMPT = """
    You are writing a LinkedIn connection request message.
    Max 300 characters. Must reference one specific fact about the company.
    No pitch in the connection request — just establish relevance.
    Tone: Warm, genuine, curious. Not salesy.
    Return ONLY valid JSON: {'message': 'string', 'signal_cited': 'string'}
    """

    CALL_PROMPT = """
    You are writing a cold call opening script.
    Max 30 seconds when read aloud (approx 75 words).
    Must include: who you are, ONE specific reason for calling (signal-based),
    a question that opens dialogue, a pause indicator.
    Tone: Confident, warm, not scripted-sounding.
    Return ONLY valid JSON: {'script': 'string', 'signal_cited': 'string'}
    """
    
    def __init__(self, config, db_session, redis_client, llm_client, memory=None):
        self.config = config
        self.db = db_session
        self.redis = redis_client
        self.llm = llm_client
        self.memory = memory  # Ruflo AgentDB
        logger.info("WriterAgent: Enhanced with Evidence-Grounded Outreach Writing.")

    async def run(self):
        """Ruflo-compatible loop for the Writer agent."""
        await self.process_queue()

    async def write_outreach(self, company_id: str):
        """
        RUFLO-ENHANCED OUTREACH GENERATION.
        Uses verified evidence to ground the sales copy.
        """
        logger.info(f"Ruflo Swarm: Generating verified outreach for Company ID {company_id}")
        
        # Recall historic success for this industry from AgentDB
        # e.g. "which outreach angles worked for Finance companies?"
        industry_context = self.memory.recall(f"success_patterns:finance") if self.memory else None

        # Implementation would follow with LLM calls using grounded content
        pass

    async def process_queue(self):
        """Loop to read 'companies:write_outreach' from Redis."""
        pass

    async def write_outreach(self, company_id: str):
        """
        IMPLEMENT THE FOLLOWING:
        1. Load company from database with all signals and intelligence card
        2. Select top 3 signals by decayed_weight for context
        3. Build context string combining:
           - Company name, industry, location, size estimate
           - Top 3 signals with their summaries
           - Detected tech stack
           - Pain points from intelligence card
           - Our recommended service and outreach angle
           - Decision-maker name and role (if found)
        4. Generate email: call LLM with EMAIL_PROMPT + context
        5. Generate LinkedIn message: call LLM with LINKEDIN_PROMPT + context
        6. Generate cold call opener: call LLM with CALL_PROMPT + context
        7. Parse all three JSON responses
        8. Create OutreachDraft record in database with all three variants
        9. Update company.outreach_draft_ready = True
        """
        pass  # Implement above
