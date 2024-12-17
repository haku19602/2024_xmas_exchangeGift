// ===== 簡化 document.getElementById() =====
function getEleId(id){
  return document.getElementById(id)
}
const peopleInput = getEleId("people") // 輸入框
const readyButton = getEleId("ready") // 提交按鈕
const cardsDiv = getEleId("cards") // 卡片區

// ===== 隨機選擇卡片 after 背景類別 =====
function randomBg() {
  const backgrounds = ["bg-1", "bg-2", "bg-3"]
  const randomIndex = Math.floor(Math.random() * backgrounds.length)
  return backgrounds[randomIndex]
}

// ===== 生成卡片 =====
function generateCards(numberOfPeople, cardsDiv) {
  // 卡片數調整為 3 or 5 的倍數
  let adjustedPeople
  if (window.innerWidth >= 1024) {
    adjustedPeople = numberOfPeople + (5 - (numberOfPeople % 5)) % 5
  } else {
    adjustedPeople = numberOfPeople + (3 - (numberOfPeople % 3)) % 3
  }

  for (let i = 1; i <= adjustedPeople; i++) {
    const card = document.createElement("div")
    card.className = `card card-close ${randomBg()}` // 隨機加上背景類別

    if (i > numberOfPeople) {
      card.classList.add("extra-card") // 餘數卡片加一個 class
      card.innerHTML = "MERRY <br> XMAS"
    } else {
      card.textContent = `${i}`
    }

    // 卡片點擊事件
    card.addEventListener("click", () => {
      // 1.移除 .card-close
      card.classList.remove("card-close")
      // 2.加入 .hide-after
      setTimeout(() => {
        card.classList.add("hide-after")
      }, 500)
    })

    cardsDiv.appendChild(card)
  }
}

// ===== 打亂卡片的函數（執行多次洗牌） =====
function shuffleCards(cardsDiv) {
  const cards = Array.from(cardsDiv.children) // 取得所有卡片元素
  const totalCards = cards.length // 卡片總數

  for (let i = 0; i < totalCards * 3; i++) {
    // 隨機選取兩個索引
    const randomA = Math.floor(Math.random() * totalCards)
    const randomB = Math.floor(Math.random() * totalCards)

    // 交換卡片的位置
    if (randomA !== randomB) {
      cardsDiv.insertBefore(cards[randomA], cards[randomB].nextSibling) // 將卡片A移動到卡片B後面
    }
  }
}

// ===== 開始按鈕點擊 =====
readyButton.addEventListener("click", () => {
  const numberOfPeople = parseInt(peopleInput.value, 10) // 獲取人數並轉換為整數
  cardsDiv.innerHTML = "" // 清空之前的卡片內容

  if (isNaN(numberOfPeople) || numberOfPeople < 3) {
    peopleInput.value = "" // 清空输入框
    alert("參加人數至少3人！")
    return
  }

  // 隱藏 .input_div
  const inputDiv = document.querySelector(".input_div") // 取得 .input_div 元素
  inputDiv.style.display = "none" // 設定 display 為 none

  generateCards(numberOfPeople, cardsDiv) // 生成卡片
  shuffleCards(cardsDiv) // 洗牌

  // 隨機選擇一張卡片並觸發點擊事件
  setTimeout(() => {
    const allCards = document.querySelectorAll(".card") // 選取所有卡片
    // const randomIndex = Math.floor(Math.random() * allCards.length) // 隨機索引
    // const randomCard = allCards[randomIndex] // 隨機選取的卡片
    // randomCard.click() // 觸發該卡片的點擊事件
    allCards[0].click() // 觸發該卡片的點擊事件
  }, 300)
})