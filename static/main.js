$(function(){
  $("#area5Box").toggle();

  // 버튼 부분
  var buttonIndex = null;
  var chk = [true, false, false, false]; // chk 배열을 전역 범위에서 정의

  $("#left_side_btn button").each(function (idx, data) {
    $(this).click(function () {
      buttonIndex = $(this).index();
      // 클릭한 버튼에 'active' 클래스를 토글(누르면 추가되고, 다시누르면 제거됨)
      $(this).toggleClass("active");
      switch (buttonIndex) {
        case 0:
          console.log("확진자 버튼이 눌렸어요");
          break;
        case 1:
          console.log("사망자 버튼이 눌렸어요");
          break;
        case 2:
          console.log("접종자 버튼이 눌렸어요");
          break;
        case 3:
          console.log("총 인구수 버튼이 눌렸어요");
          break;
      } // switch case
      data_call();
      chk[buttonIndex] = !chk[buttonIndex];
      console.log("chk:" + chk);
    });
  });
  
  // 슬라이드, 월별 부분
  var months = [
    "2020년 1월","2020년 2월","2020년 3월","2020년 4월","2020년 5월","2020년 6월","2020년 7월","2020년 8월","2020년 9월","2020년 10월","2020년 11월","2020년 12월",
    "2021년 1월","2021년 2월","2021년 3월","2021년 4월","2021년 5월","2021년 6월","2021년 7월","2021년 8월","2021년 9월","2021년 10월","2021년 11월 , 오미크론 발생","2021년 12월",
    "2022년 1월","2022년 2월","2022년 3월","2022년 4월","2022년 5월","2022년 6월","2022년 7월","2022년 8월","2022년 9월","2022년 10월","2022년 11월","2022년 12월",
    "2023년 1월","2023년 2월","2023년 3월","2023년 4월","2023년 5월","2023년 6월","2023년 7월","2023년 8월","2023년 9월","2023년 10월","2023년 11월",
  ];
  // 슬라이드 바의 value 값을 전역 변수로 설정
  var selectedMonthIndex = 21;
  var selectedMonth = months[selectedMonthIndex];
  $("#month-display").text(selectedMonth);

  $("#lever").change(function () {
    selectedMonthIndex = $(this).val();
    selectedMonth = months[selectedMonthIndex];
    data_call();
    var str = "";
    if (selectedMonth === "2021년 11월 , 오미크론 발생") {
      var array1_1 = selectedMonth.split(",");
      for (var i in array1_1) {
        if (i == 1) {
          str += "<span style='color:red;'>" + array1_1[i] + "</span><br>";
        } else {
          str += "<span>" + array1_1[i] + "</span><br>";
        }
      }
      console.log(str);
      $("#month-display").html(str);
    } else $("#month-display").text(selectedMonth);
    console.log("슬라이더 값 변경: " + selectedMonth);
  });
  data_call();

  // 데이터 부분
  function chked_data(data, chk) {
    // console.log("chk array:", chk);
    // console.log("data array:", data);
    const filter_data = data.filter((_, i) => chk[i]);
    console.log('filter_data:', filter_data);
    return filter_data;
  }
  var chartInstances = [];
  function make_chart(myChart, labels, label, data, chartIndex) {
    const ctx = document.getElementById(myChart).getContext("2d");
    console.log("차트 생성 코드 실행됨" + ctx);
    console.log("Label:", label);
    console.log("Labels:", labels);
    console.log("Data:", data);
    $("#" + myChart).css({
      "background-color": "white",
      "border-radius": "5%",
    });
    data = {
      labels: labels,
      datasets: [{
            label: label,
            data: chked_data(
              chk[3]
                ? [data[0] / data[3], data[1] / data[3], data[2] / data[3]]
                : data.slice(0, 3),
              chk.slice(0, 3)
            ),
            backgroundColor: chked_data([
              "rgba(0, 0, 255,0.5 )",
              "rgba(255, 0, 0,0.5)",
              "rgba(0, 128, 0,0.5)"
            ], chk.slice(0, 3)),
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 1,
          }],
    };
    options = {
      scales: {
        x: {
          display: true
        },
        y: {
          display: true,
          type: "logarithmic"
        },
      },
      plugins: {
        title: {
          display: true,
          text: label,
          font: {
            size: 18
          }
        },
        legend: {
          display: false // 레이블 박스 표시 비활성화
        },
      },
    };
    var matchingChart = chartInstances.find(function (chart) {
      return chart.canvas.id === myChart;
    });
    if (matchingChart == undefined) {
      newChart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: options
      });
      chartInstances.push(newChart);
    } else {
      chartInstances[chartIndex].data = data;
      chartInstances[chartIndex].update();
    }
  }

  function data_call() {
    $.ajax({
      type: "get", // 타입 (get, post, put 등등)
      url: "/ajax", // 요청할 서버 url    async : true, // 비동기화 여부 (default : true)
      data: { month: selectedMonthIndex },
      dataType: "json",
      success: function (data) {
        console.log("요청 성공", data);
        const labels = chked_data(
          ["확진자", "사망자", "접종자"],
          chk.slice(0, 3)
        );

        const SAF = Object.values(data["SAF"]);
        const AFR = Object.values(data["AFR"]);
        const ASIA = Object.values(data["ASIA"]);
        const CHN = Object.values(data["CHN"]);
        const KOR = Object.values(data["KOR"]);
        const AUS = Object.values(data["AUS"]);
        const JPN = Object.values(data["JPN"]);
        const RSI = Object.values(data["RSI"]);
        const EEU = Object.values(data["EEU"]);
        const WEU = Object.values(data["WEU"]);
        const NAM = Object.values(data["NAM"]);
        const USA = Object.values(data["USA"]);
        const SAM = Object.values(data["SAM"]);

        const loc_name_list = ["남아프리카공화국","아프리카","아시아","중국","한국","오세아니아","일본","러시아","동유럽","서유럽","북아메리카","미국","남아메리카"];
        const loc_data_list = [SAF,AFR,ASIA,CHN,KOR,AUS,JPN,RSI,EEU,WEU,NAM,USA,SAM];
        const chart_id_list = [
          "area1_chart","area2_chart","area3_chart","area4_chart","area5_chart","area6_chart","area7_chart",
          "area8_chart","area9_chart","area10_chart","area11_chart","area12_chart","area13_chart",
        ];

        for (let i = 0; i < loc_data_list.length; i++) {
          const chart_name = chart_id_list[i];
          const loc_code = loc_name_list[i];
          const loc_data = loc_data_list[i];

          make_chart(chart_name, labels, loc_code, loc_data, i);
        }
      }, //success callback
      error: function (error) {
        console.log("에러 발생", error);
      },
    }); //ajax
  }
  
  $("area").click(function () {
    console.log("클릭 이벤트 발생");
    console.log("selectedMonthIndex 값:", selectedMonthIndex);
    var areaId = $(this).attr("id");
    var $areaBox = $("#" + areaId + "Box");

    $areaBox.toggle();
  }); //click

  $(".areaBox").click(function () {
    $(this).hide();
  });

  $('.map').maphilight();

  $.fn.maphilight.defaults = {
    fill: true,
    fillColor: 'CCCCCC',
    fillOpacity: 0.5,
    stroke: true,
    strokeColor: 'FFFFFF',
    strokeOpacity: 1,
    strokeWidth: 1
  }
  $('img[usemap]').maphilight();

  function getAreaContent(areaId) {
    var areaContents = {
      'area1': '남아공','area2': '아프리카','area3': '아시아','area4': '중국','area5': '한국','area6': '오세아니아',
      'area7': '일본','area8': '러시아','area9': '동유럽','area10': '서유럽','area11': '북아메리카','area12': '미국',
      'area13': '남아메리카'
    };
    return areaContents[areaId];
  }

  // 호버 시 국가 이름
  $('area').hover(function (event) {
    var areaContent = getAreaContent($(this).attr('id'));

    $('#infoBox').html(areaContent).css({
      top: event.pageY + 'px',
      left: event.pageX + 'px',
      display: 'block'
    });
  }, function () {
    $('#infoBox').css('display', 'none');
  });

  $('body').append('<div id="infoBox"></div>');
});