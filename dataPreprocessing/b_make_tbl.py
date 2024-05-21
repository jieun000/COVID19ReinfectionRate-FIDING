import MySQLdb
from a_init_data import loc_code_list

# DB(MySql)에 테이블을 만드는 함수.
def create_loc_code_tbl():
    for loc_code in loc_code_list:
        conn = MySQLdb.connect(host="localhost", port=3306, user="root", passwd="1234", db="c")
        sql = f'''CREATE TABLE %s_tbl (
                    date_day date,
                    loc_code varchar(5),
                    total_cases DOUBLE,
                    total_deaths DOUBLE,
                    total_vaccinations DOUBLE,
                    total_population DOUBLE
                )'''%loc_code
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()

if __name__ == '__main__':
    create_loc_code_tbl()