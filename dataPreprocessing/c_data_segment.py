import pandas as pd
import os
from a_init_data import loc_code_list,C_L_dict
#중동은 아시아와 아프리카 두 대륙에 포함되어 있어 제외하였다

data_dict={i:pd.DataFrame(columns=["date_day", "loc", "total_cases",'total_deaths','total_vaccinations','total_population']) for i in loc_code_list}
data1 = pd.read_csv('owid-covid-data.csv')[['date', 'continent', 'location', 'new_cases', 'new_deaths', 'population']]
data2= pd.read_csv('vaccinations.csv')[['date', 'location', 'daily_vaccinations']]

def segment_by_continent_and_location(group,continent,location,data_dict,C_L_dict):
    """
        데이터 분류의 효율성을 높이기 위해 대륙 별로 분류된 데이터에서
        우리가 원하는 지역별 데이터를 분류하여
        data_dict에 담는다.
    """
    continents,location_dict=C_L_dict.keys(),C_L_dict.values()
    for continent_ in continents:
        if continent != continent_:
            continue
        for name,loction_list in C_L_dict[continent_].items():
            if loction_list:
                if location in loction_list:
                    data_dict[name] = pd.concat([data_dict.get(name, pd.DataFrame({})), group])
            else:
                data_dict[name] = pd.concat([data_dict.get(name, pd.DataFrame({})), group])
# pd.to_datetime(): datetime(날짜와 시간) 객체로 변환.
# dt.: datetime 구성 요소(예: 연, 월, 일 등)에 액세스.
# to_period('M'): 월별로 그룹화.
def segment_data_to_csv():
    data=pd.merge(data1, data2, on=['date', 'location'], how='outer')

    data['month'] = pd.to_datetime(data['date']).dt.to_period('M')

    for month, month_group in data.groupby('month'):
        data_segment_by_month_dict = {i: pd.DataFrame({}) for i in loc_code_list}
        for continent, continent_group in month_group.groupby('continent'):
            for location, location_group in continent_group.groupby('location'):
                segment_by_continent_and_location(location_group,continent,location,data_segment_by_month_dict,C_L_dict)
        for loc_code, loc_df in data_segment_by_month_dict.items():
            try:
                data_dict[loc_code] = pd.concat([data_dict[loc_code],
                                           pd.DataFrame({'date_day': [month],
                                                         'loc': [loc_code],
                                                         'total_cases': [loc_df['new_cases'].sum()],
                                                         'total_deaths': [loc_df['new_deaths'].sum()],
                                                         'total_vaccinations': [loc_df['daily_vaccinations'].sum()],
                                                         'total_population':[loc_df['population'].unique().sum()]})])
            except:
                print(f'ERORR: month(%s)  loc_code(%s)'%(month,loc_code),)
    for loc_code, loc_df in data_dict.items():
        filename = f'../data_segment_by_loc_code/{loc_code}.csv'
        data_dict[loc_code].to_csv(filename, index=False)

if __name__ == '__main__':
    try:
        os.mkdir('../data_segment_by_loc_code')
    except:
        pass
    segment_data_to_csv()