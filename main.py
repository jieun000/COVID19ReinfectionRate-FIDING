from flask import Flask, render_template, request, json
import pandas as pd
from sql_func import from_sql
from dataPreprocessing.a_init_data import loc_code_list

# Flask 애플리케이션을 생성하고 app 변수에 할당
app = Flask(__name__)

date_loc_data_dict = {}

# 데이터프레임을 특정 방식(기본값은 'split')으로 JSON으로 변환하는 함수
def to_json2(df,orient='split'):
    df_json = df.to_json(orient=orient, force_ascii=False)
    return json.loads(df_json)

# 루트 경로에 대한 라우트를 정의. 즉, 홈페이지에 접속했을 때 실행될 함수를 지정
@app.route('/')
def start():
    global date_loc_data_dict
    from_sql(date_loc_data_dict,loc_code_list)
    return render_template('main.html')

@app.route('/ajax')
def hello():
    global date_loc_data_dict
    month_idx = int(request.args.get('month'))
    print(month_idx)
    date=date_loc_data_dict.keys()
    loc_data_dict_by_date = date_loc_data_dict[list(date)[month_idx]]
    json2_list=[]
    for loc_code in loc_code_list:
        df=pd.DataFrame([loc_data_dict_by_date[loc_code]])
        json2_list.append(to_json2(pd.DataFrame(df)))
    result_df = pd.DataFrame(loc_data_dict_by_date).T
    print(result_df)
    json_result = result_df.to_json(orient='index')
    return json_result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
