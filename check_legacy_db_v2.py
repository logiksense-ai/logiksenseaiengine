import psycopg2

def check_db(db_name):
    print(f"\n===== Checking Database: {db_name} =====")
    try:
        conn = psycopg2.connect(f'postgresql://db_username:logiksense@localhost:5432/{db_name}')
        cur = conn.cursor()
        
        # Check LinkedIn Accounts
        try:
            cur.execute("SELECT count(*) FROM linkedin_accounts")
            count = cur.fetchone()[0]
            print(f"linkedin_accounts Count: {count}")
            if count > 0:
                cur.execute("SELECT * FROM linkedin_accounts")
                rows = cur.fetchall()
                for r in rows:
                    print(f"  Row: {r}")
        except:
            print("linkedin_accounts table not found or error")

        # Check Email Configs
        try:
            cur.execute("SELECT count(*) FROM email_configs")
            count = cur.fetchone()[0]
            print(f"email_configs Count: {count}")
            if count > 0:
                cur.execute("SELECT * FROM email_configs")
                rows = cur.fetchall()
                for r in rows:
                    print(f"  Row: {r}")
        except:
            print("email_configs table not found or error")

        conn.close()
    except Exception as e:
        print(f"Could not connect: {e}")

        # Check Auth User
        try:
            cur.execute("SELECT count(*) FROM auth_user")
            count = cur.fetchone()[0]
            print(f"auth_user Count: {count}")
            if count > 0:
                cur.execute("SELECT email FROM auth_user")
                rows = cur.fetchall()
                for r in rows:
                    print(f"  User: {r[0]}")
        except:
            print("auth_user table not found or error")

if __name__ == "__main__":
    check_db('logiksense_marketing')
    check_db('logiksense_app_stable')
    check_db('logiksense_app_local')
    check_db('social_scheduler')
