import mysql.connector

def from_sql(date_loc_data_dict,loc_code_list):
    for loc_code in loc_code_list:
        mysql_config = {
            'user': 'root',
            'password': '1234',
            'host': 'localhost',
            'database': 'c'
        }
        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor()
        cursor.execute(f"select * from %s_tbl"%(loc_code))
        data_list = cursor.fetchall()
        for date_day,loc_code, total_cases, total_deaths, people_vaccinated,population in data_list:
            date_loc_data_dict[date_day]=date_loc_data_dict.get(date_day,{})
            date_loc_data_dict[date_day][loc_code]=date_loc_data_dict[date_day].get(loc_code,{})
            date_loc_data_dict[date_day][loc_code].update( {
                'total_cases':total_cases,
                'total_deaths':total_deaths,
                'people_vaccinated':people_vaccinated,
                'population':population}
            )