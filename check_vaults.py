import psycopg2

def search_vault(db_name):
    print(f"\n--- Checking Vault in {db_name} ---")
    try:
        conn = psycopg2.connect(f'postgresql://db_username:logiksense@localhost:5432/{db_name}')
        cur = conn.cursor()
        
        # Check if vault_secrets exists
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_name = 'vault_secrets'")
        if not cur.fetchone():
            conn.close()
            return
            
        cur.execute("SELECT count(*) FROM vault_secrets")
        cnt = cur.fetchone()[0]
        print(f"  vault_secrets Count: {cnt}")
        
        if cnt > 0:
            cur.execute("SELECT id, ref_key, scope FROM vault_secrets")
            rows = cur.fetchall()
            for r in rows:
                print(f"  Secret: ID={r[0]}, Ref={r[1]}, Scope={r[2]}")
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dbs = ['logiksense_marketing', 'logiksense_app_stable', 'logiksense_app_local', 'logiksense_marketing_copy', 'social_scheduler', 'messaging_db', 'propfix_db']
    for db in dbs:
        search_vault(db)
