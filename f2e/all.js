const travelApi = 'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW';
let data = [];
let gender = {
    male: 0,
    female: 0,
    ratio: 0,
}

axios.get(travelApi)
.then(response => {
	data = response.data;

    // 撈出公司資訊
    let companyData = []
    data.forEach(item => {
        companyData.push(item.company)
    })

    // 抓取各產業的薪資滿意度、產業滿意度的平均分數
    let industryData = [];

    data.forEach((item, idx) => {
        let industryName = item.company.industry;
        industryData.push({
            industryName: industryName,
            number: 0,
            sumScore: 0,
            avgScore: 0,
            sumSalaryScore: 0,
            avgSalaryScore: 0,
        })

        // 移除重複obj
        industryData = industryData.filter((item, index, array) =>
            index === array.findIndex((t) => (
                t.industryName === item.industryName
            ))
        )

        // 抓出單筆物件
        let industry = industryData.filter(e => e.industryName === industryName)[0];
        industry.number++;
        industry.sumScore += Number(item.company.score);
        industry.sumSalaryScore += Number(item.company.salary_score);
  
        // 產業薪資滿意度平均，取小數點後第二位
        industry.avgSalaryScore = Math.round(industry.sumSalaryScore / industry.number * 100) / 100;

        // 產業滿意度的平均，取小數點後第二位
        industry.avgScore = Math.round(industry.sumScore / industry.number * 100) / 100;

    })
    
    console.log(industryData);

    // 撈取男性跟女性比例有多少
    data.forEach(item => {
        if ( item.gender === '男性' ) {
            gender.male ++;
        } else {
            gender.female ++;
        }
    })
    gender.ratio = Math.round(gender.female / gender.male * 100) / 100;
    console.log(`男性：${gender.male}人，女性：${gender.female}人，男女比 1:${gender.ratio}`);
})
.catch((error) => {
	alert('資料讀取錯誤，請稍後再試');
	console.error(error);
});

