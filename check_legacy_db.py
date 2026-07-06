import psycopg2
import os

def check_db():
    try:
        conn = psycopg2.connect('postgresql://db_username:logiksense@localhost:5432/logiksense_app_stable')
        cur = conn.cursor()
        
        print("--- Tables in logiksense_app_stable ---")
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cur.fetchall()
        for t in tables:
            print(f"Table: {t[0]}")
            
        conn.close()
            
        print("\n--- Details for linkedin_accounts (STABLE) ---")
        cur.execute("SELECT * FROM linkedin_accounts")
        rows = cur.fetchall()
        print(f"Count: {len(rows)}")
        for r in rows:
            print(f"Row: {r}")
            
        print("\n--- Details for email_configs (STABLE) ---")
        cur.execute("SELECT * FROM email_configs")
        rows = cur.fetchall()
        print(f"Count: {len(rows)}")
        for r in rows:
            print(f"Row: {r}")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
