import psycopg2
import uuid
from datetime import datetime

def seed_linkedin():
    try:
        conn = psycopg2.connect('postgresql://db_username:logiksense@localhost:5432/logiksense_marketing')
        cur = conn.cursor()
        
        # Get Workspace ID (we saw cf2887bd-7185-4b39-9f55-1dda10b0d015 in email_configs)
        cur.execute("SELECT id FROM workspaces LIMIT 1")
        ws_row = cur.fetchone()
        workspace_id = ws_row[0] if ws_row else str(uuid.uuid4())
        
        # Get Customer ID
        cur.execute("SELECT id FROM customers LIMIT 1")
        cust_row = cur.fetchone()
        customer_id = cust_row[0] if cust_row else str(uuid.uuid4())

        print(f"Seeding LinkedIn for {workspace_id}...")
        
        # Check columns first
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'linkedin_accounts'")
        cols = [c[0] for c in cur.fetchall()]
        print(f"Columns: {cols}")
        
        account_id = str(uuid.uuid4())
        email = "bipinpanjari@gmail.com"
        
        # Construct dynamic insert
        vals = {
            'id': account_id,
            'workspace_id': workspace_id,
            'customer_id': customer_id,
            'email': email,
            'status': 'active',
            'account_type': 'PERSONAL',
            'session_vault_ref': account_id,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Filter vals by existing columns
        active_vals = {k: v for k, v in vals.items() if k in cols}
        
        placeholders = ", ".join(["%s"] * len(active_vals))
        columns = ", ".join(active_vals.keys())
        query = f"INSERT INTO linkedin_accounts ({columns}) VALUES ({placeholders}) ON CONFLICT DO NOTHING"
        
        cur.execute(query, list(active_vals.values()))
        conn.commit()
        print(f"✅ Successfully seeded LinkedIn Account: {email}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    seed_linkedin()
