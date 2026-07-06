import psycopg2

def find_linkedin_tables(db_name):
    print(f"\n--- Maps for Database: {db_name} ---")
    try:
        conn = psycopg2.connect(f'postgresql://db_username:logiksense@localhost:5432/{db_name}')
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name ILIKE '%linkedin%'")
        tables = cur.fetchall()
        for t in tables:
            cur.execute(f"SELECT count(*) FROM {t[0]}")
            cnt = cur.fetchone()[0]
            print(f"  Table: {t[0]} (Count: {cnt})")
            if cnt > 0:
                cur.execute(f"SELECT * FROM {t[0]} LIMIT 1")
                print(f"    Example: {cur.fetchone()}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dbs = ['logiksense_marketing', 'logiksense_app_stable', 'logiksense_app_local', 'logiksense_marketing_copy', 'social_scheduler', 'messaging_db', 'propfix_db']
    for db in dbs:
        find_linkedin_tables(db)
