import csv
import MySQLdb
import datetime
from a_init_data import loc_code_list

# 문자열을 실수로 변환하는 함수
def string_to_float(s):
    """
    csv의 열데이터'date_day, total_cases, total_deaths,people_vaccinated' 중 Nan이 있어
    float()함수가 제대로 작동하지 않아 빈 문자열을 0.0으로 변환하는 함수를 작성
    :param s:
    :return:
    """
    if s=='': return 0.0
    else: return float(s)

# DB에 데이터를 입력하는 함수
def insert_data():
    for loc_code in loc_code_list:
        with open(f'../data_segment_by_loc_code/%s.csv'%loc_code) as csvfile:
            reader = csv.DictReader(csvfile, delimiter=',')
            for  idx,row in enumerate(reader):
                conn = MySQLdb.connect(host="localhost", port=3306, user="root", passwd="1234", db="c")
                # 17개 시도
                sql_statement = f'INSERT INTO %s_tbl'%loc_code +'(date_day,loc_code, total_cases, total_deaths,total_vaccinations,total_population ) VALUES (%s,%s,%s, %s,%s,%s)'

                # 'date_day' 칼럼을 날짜로 변환
                date_day = datetime.datetime.strptime(row['date_day'], '%Y-%m').date()

                cur = conn.cursor()
                tupled_list= (date_day,loc_code, string_to_float(row['total_cases']), string_to_float(row['total_deaths']), string_to_float(row['total_vaccinations']), string_to_float(row['total_population']))
                cur.execute(sql_statement, tupled_list)
                conn.escape_string(sql_statement)
                conn.commit()
                if idx%10==0:
                    print("진행중 ==========================="+str(idx))

if __name__ == '__main__':
    insert_data()