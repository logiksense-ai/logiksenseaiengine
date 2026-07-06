import psycopg2

def check_all_tables_with_data(db_name):
    print(f"\n--- Tables with Data in {db_name} ---")
    try:
        conn = psycopg2.connect(f'postgresql://db_username:logiksense@localhost:5432/{db_name}')
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        for t in tables:
            try:
                cur.execute(f"SELECT count(*) FROM {t}")
                cnt = cur.fetchone()[0]
                if cnt > 0:
                    print(f"  {t}: {cnt}")
            except:
                continue
        conn.close()
    except Exception as e:
        print(f"Error connecting to {db_name}: {e}")

if __name__ == "__main__":
    check_all_tables_with_data('logiksense_marketing')
    check_all_tables_with_data('logiksense_app_stable')
