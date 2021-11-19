"use strict";

let data = [];
const addTicketForm = document.querySelector('.addTicket-form');
const addTicketBtn = document.querySelector('.addTicket-btn');
const searchResult = document.querySelector("#searchResult-text");
const regionSearch = document.querySelector(".regionSearch");
const ticketCardArea = document.querySelector(".ticketCard-area");

function addTicket() {
	for (let idx = 0; idx < addTicketForm.length; idx++) {
		if ( addTicketForm[idx].value === '' ) {
			alert('請確認資訊是否輸入完全');
			return;
		}
		if ( addTicketForm[1].value.indexOf('http://') && addTicketForm[1].value.indexOf('https://') ) {
			alert('請輸入正確網址');
			return;
		} else if ( !isNaN(addTicketForm[3]) || !isNaN(addTicketForm[4]) || !isNaN(addTicketForm[5]) ) {
			alert('請輸入數字');
			return;
		} else if ( addTicketForm[5].value < 1 || addTicketForm[5].value > 10 ) {
			alert('套票星級為1~10');
			return;
		} else if ( addTicketForm[6].value.length > 100 ) {
			alert('限 100 字');
			return;
		}
	}

	data.push({
		id:				data.length,
		name:			addTicketForm[0].value,
		imgUrl:			addTicketForm[1].value,
		area:			addTicketForm[2].value,
		description:	addTicketForm[6].value,
		group:			Number(addTicketForm[4].value),
		price:			Number(addTicketForm[3].value),
		rate:			Number(addTicketForm[5].value),
	});

	addTicketForm.reset();
	addTicketForm[2].value = '';
	renderData(data);
}

function renderData(data) {
	let structure = '';
	data.forEach(item => {
		structure += `<li class="ticketCard">
			<div class="ticketCard-img">
				<a href="#">
					<img src="${item.imgUrl}" alt="${item.name}" />
				</a>
				<div class="ticketCard-region">${item.area}</div>
				<div class="ticketCard-rank">${item.rate}</div>
			</div>
			<div class="ticketCard-content">
				<div>
					<h3>
						<a href="#" class="ticketCard-name">${item.name}</a>
					</h3>
					<p class="ticketCard-description">
						${item.description}
					</p>
				</div>
				<div class="ticketCard-info">
					<p class="ticketCard-num">
						<span><i class="fas fa-exclamation-circle"></i></span>
						剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
					</p>
					<p class="ticketCard-price">
						TWD <span id="ticketCard-price">$${item.price}</span>
					</p>
				</div>
			</div>
		</li>`;
	});
	searchResult.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
	ticketCardArea.innerHTML = structure;
	arrayRegion(data);
}

function arrayRegion(data) {
	let region = {};
	let regionData;
	data.forEach(el => {
		region[el.area] = region[el.area] ? (region[el.area] + 1) : 1;
	});
	regionData = Object.keys(region).map((key) => [key, region[key]]);

	const chart = c3.generate({
		bindto: "#chart",
		interaction: {
			enabled: false
		},
		data: {
			columns: regionData,
			type : 'donut',
			colors:{
				'台北': '#26BFC7',
				'台中': '#5151D3',
				'高雄': '#E68618'
			}
		},
		tooltip: {
			show: false
		},
		donut: {
			width: 14,
			expand: false,
			label: {
				show: false
			},
			title: '套票地區比重'
		}
	});
}

function filterRegion(region, data) {
	if (region === "全部地區") {
		renderData(data);
		return;
	} else if (region !== "地區搜尋") {
		const newData = data.filter(function (item) {
			return item["area"] == region;
		});
		renderData(newData);
	}
}

// 在以下 URL 的部分填入 API 網址
const travelApi = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
axios.get(travelApi)
.then(response => {
	data = response.data.data;
	renderData(data);
})
.catch((error) => {
	alert('資料讀取錯誤，請稍後再試');
	console.error(error);
});

addTicketBtn.addEventListener('click', (e) => {
	if (e.target.value !== "新增套票") {
		return
	}
	addTicket();
	filterRegion(regionSearch.value, data);
	location.hash = '#search-result-content';
});

regionSearch.addEventListener("change", function () {
	filterRegion(regionSearch.value, data);
});
