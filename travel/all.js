"use strict";

let data = [
	{
		id: 0,
		name: '肥宅心碎賞櫻3日',
		imgUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80',
		area: '高雄',
		description: '賞櫻花最佳去處。肥宅不得不去的超讚景點！',
		group: 87,
		price: 1400,
		rate: 10
	},
	{
		id: 1,
		name: '貓空纜車雙程票',
		imgUrl: 'https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
		area: '台北',
		description: '乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感',
		group: 99,
		price: 240,
		rate: 2
	},
	{
		id: 2,
		name: '台中谷關溫泉會1日',
		imgUrl: 'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
		area: '台中',
		description: '全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。',
		group: 20,
		price: 1765,
		rate: 7
	}
];

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
}
renderData(data);

addTicketBtn.addEventListener('click', (e) => {
	if (e.target.value !== "新增套票") {
		return
	}
	addTicket();
	location.hash = '#search-result-content';
});

regionSearch.addEventListener("change", function () {
	console.log(regionSearch.value);
	if (regionSearch.value === "全部地區") {
		renderData(data);
		return;
	} else {
		const newData = data.filter(function (item) {
			return item["area"] == regionSearch.value;
		});
		renderData(newData);
	}
});  
