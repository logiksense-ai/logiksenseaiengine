import psycopg2

def search_email_in_db(db_name, email):
    print(f"\n--- Searching in Database: {db_name} ---")
    try:
        conn = psycopg2.connect(f'postgresql://db_username:logiksense@localhost:5432/{db_name}')
        cur = conn.cursor()
        
        # Get all tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        
        for table in tables:
            try:
                # Get columns for this table
                cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}'")
                columns = [c[0] for c in cur.description] # Wait, this gets column names of the info_schema
                cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}'")
                cols = [c[0] for c in cur.fetchall()]
                
                # Check if any column contains the email
                for col in cols:
                    query = f"SELECT count(*) FROM {table} WHERE CAST({col} AS TEXT) ILIKE %s"
                    cur.execute(query, (f'%{email}%',))
                    count = cur.fetchone()[0]
                    if count > 0:
                        print(f"  FOUND in Table: {table}, Column: {col} (Count: {count})")
                        # Fetch one row to see context
                        cur.execute(f"SELECT * FROM {table} WHERE CAST({col} AS TEXT) ILIKE %s LIMIT 1", (f'%{email}%',))
                        print(f"    Example Row: {cur.fetchone()}")
            except Exception as e:
                # Silently skip tables that fail (e.g. permission issues or complex types)
                continue
                
        conn.close()
    except Exception as e:
        print(f"Could not connect to {db_name}: {e}")

if __name__ == "__main__":
    target_email = "bipinpanjari@gmail.com"
    dbs = ['logiksense_marketing', 'logiksense_app_stable', 'logiksense_app_local', 'logiksense_marketing_copy', 'social_scheduler', 'messaging_db', 'propfix_db']
    for db in dbs:
        search_email_in_db(db, target_email)
