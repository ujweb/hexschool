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
            產業名稱: industryName,
            人數: 0,
            產業滿意度總分: 0,
            產業滿意度平均: 0,
            薪資滿意度總分: 0,
            薪資滿意度平均: 0,
        })

        // 移除重複obj
        industryData = industryData.filter((item, index, array) =>
            index === array.findIndex((t) => (
                t.產業名稱 === item.產業名稱
            ))
        )

        // 抓出單筆物件
        let industry = industryData.filter(e => e.產業名稱 === industryName)[0];
        industry.人數++;
        industry.產業滿意度總分 += Number(item.company.score);
        industry.薪資滿意度總分 += Number(item.company.salary_score);
  
        // 產業薪資滿意度平均，取小數點後第二位
        industry.薪資滿意度平均 = Math.round(industry.薪資滿意度總分 / industry.人數 * 100) / 100;

        // 產業滿意度的平均，取小數點後第二位
        industry.產業滿意度平均 = Math.round(industry.產業滿意度總分 / industry.人數 * 100) / 100;

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

