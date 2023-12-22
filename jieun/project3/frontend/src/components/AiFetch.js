import React, { useEffect, useState, useImperativeHandle } from 'react';


const AiFetch = React.forwardRef(({obj}, ref) => {
  console.log("AiFetch 기동")
  var { 
    dataPost, 
    setPyCharmData,
    loadKey
  }  = obj;
  const fetchData = async () => {
      try {
        // console.log("파이참 서버로 보내는 데이터:", dataPost);
        const response2 = await fetch('http://localhost:5000/api/data', {
          method: 'post',
          //mode: 'cors',  // Cross-Origin 문제 해결을 위한 설정
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataPost),
        });
        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response2.status}`);
        }
  
        // if (!response2.ok) {
        //   throw new Error(`HTTP error! Status: ${response2.status}`);
        // }
        const result = await response2.json();
        // console.log('pycharm에서 온 데이터:', result);
        setPyCharmData(result);
      } catch (error) {
        console.error(error);
      }
    };

    useImperativeHandle(ref, () => ({
      fetchData
    }));

    useEffect(() => {
      fetchData();
    }, [loadKey]);

    return <></>;
  });

export default AiFetch