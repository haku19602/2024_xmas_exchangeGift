// ===== 簡化 document.getElementById() =====
function getEleId(id){
  return document.getElementById(id)
}
const peopleInput = getEleId("people") // 輸入框
const readyButton = getEleId("ready") // 提交按鈕
const cardsDiv = getEleId("cards") // 卡片區

// ===== 隨機生成卡片背景類別 =====
function randomBg() {
  const backgrounds = ["bg-1", "bg-2", "bg-3"]
  const randomIndex = Math.floor(Math.random() * backgrounds.length)
  return backgrounds[randomIndex]
}

// ===== 生成卡片 =====
function generateCards(numberOfPeople, cardsDiv) {
  // 卡片數調整為 3 or 5 的倍數
  const adjustedPeople = window.innerWidth > 1024 ?
    numberOfPeople + (5 - (numberOfPeople % 5)) % 5
  :
    numberOfPeople + (3 - (numberOfPeople % 3)) % 3

  for (let i = 1; i <= adjustedPeople; i++) {
    const randomBgClass = randomBg() // 隨機背景 class
    const card = document.createElement("div")
    card.className = `card card-close ${randomBgClass} fade-in`

    if (i > numberOfPeople) {
      card.classList.add("extra-card") // 餘數卡片 class
      card.classList.remove("card-close", randomBgClass)
      card.innerHTML = "MERRY <br> XMAS"
    } else {
      card.textContent = `${i}`
    }

    // 定義卡片點擊事件
    card.addEventListener("click", () => {
      // 1.移除 .card-close
      card.classList.remove("card-close")
      // 2.加入 .hide-after
      setTimeout(() => {
        card.classList.add("hide-after")
      }, 500)
    })

    cardsDiv.appendChild(card)

    // 卡片逐漸顯現動畫效果
    setTimeout(() => {
      card.classList.remove("fade-in")
    }, 200)
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
  const numberOfPeople = parseInt(peopleInput.value, 10) // 獲取人數轉換為整數數字
  cardsDiv.innerHTML = "" // 清空之前的卡片內容

  // 錯誤處理
  if (isNaN(numberOfPeople)) {
    peopleInput.value = "" // 清空输入框
    alert("請輸入數字！")
    return
  } else if (numberOfPeople < 3) {
    peopleInput.value = ""
    alert("參加人數最少3人！")
    return
  } else if (numberOfPeople > 99) {
    peopleInput.value = ""
    alert("參加人數最多99人！")
    return
  }

  // 隱藏 .input_div
  const inputDiv = document.querySelector(".input_div")
  inputDiv.style.display = "none"

  // 顯示 loading.svg
  const loadingDiv = document.createElement("div") // 創建一個 loading 容器
  loadingDiv.classList.add("loading")
  loadingDiv.innerHTML = '<img src="./img/loading.svg" alt="loading...">' // 插入 loading.svg 圖片
  document.body.appendChild(loadingDiv) // 加入到頁面中

  // 延遲 1 秒 -> 移除 loading、生成卡片
  setTimeout(() => {
    loadingDiv.remove() // 移除 loading 動畫
    generateCards(numberOfPeople, cardsDiv) // 生成卡片
    shuffleCards(cardsDiv) // 洗牌

    // 延遲 1 秒 -> 觸發第一張卡片點擊事件
    setTimeout(() => {
      const allCards = document.querySelectorAll(".card-close")
      allCards[0].click()
    }, 1000)

  }, 1500)
})