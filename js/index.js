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
        checkAllCardsOpened()
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

// ===== 添加 reset 按鈕 =====
function addResetButton() {
  const resetButton = document.createElement("img")
  resetButton.src = "./img/reset.svg"
  resetButton.alt = "reset"
  resetButton.className = "reset fade-in"

  // 定義按鈕點擊事件
  resetButton.addEventListener("click", () => {
    showResetDialog() // 顯示確認視窗
  })

  // 將按鈕插入 #main
  const mainElement = document.getElementById("main")
  mainElement.insertBefore(resetButton, mainElement.firstChild)

  // 按鈕漸漸出現效果
  setTimeout(() => {
    resetButton.classList.remove("fade-in")
  }, 200)
}

// ===== 顯示確認重置視窗 =====
function showResetDialog() {
  // 創建 dialog 元素
  const dialog = document.createElement("dialog")
  dialog.className = "reset-dialog"
  // 視窗內容
  dialog.innerHTML = `
    <p>確定要重置嗎？</p>
    <div class="dialog-buttons">
      <button id="confirm-reset">確定</button>
      <button id="cancel-reset">取消</button>
    </div>
  `

  document.body.appendChild(dialog)
  dialog.showModal()

  // 定義點擊確認重置
  document.getElementById("confirm-reset").addEventListener("click", () => {
    // performReset() // 執行重置動作
    dialog.close()
    dialog.remove()
    
    const inputDiv = document.querySelector(".input_div")

    // 清空卡片區域
    cardsDiv.innerHTML = ""

    // 顯示輸入框
    inputDiv.style.display = "flex"
    peopleInput.value = ""

    // 移除重置按鈕
    const resetButton = document.querySelector(".reset")
    resetButton.remove()
  })

  // 定義點擊取消重置
  document.getElementById("cancel-reset").addEventListener("click", () => {
    dialog.close()
    dialog.remove()
  })
}

// ===== 顯示開始提示訊息 =====
function showStartMessage(cardNumber) {
  // 創建 dialog 元素
  const dialog = document.createElement("dialog")
  dialog.classList.add("start-dialog")
  // dialog.innerHTML = message
  dialog.innerHTML = `
    <h3>從 ${cardNumber} 號玩家開始！</h3>
    <p>
      點開任一張彩繪卡片，<br>
      抽出你的禮物號碼！
    </p>
    <h5>最後被抽出的玩家得到 ${cardNumber} 號禮物</h5>
    <button id="confirm-start">準備好了</button>
  `

  document.body.appendChild(dialog)
  dialog.showModal()

  // 定義點擊準備好了
  document.getElementById("confirm-start").addEventListener("click", () => {
    dialog.close()
    dialog.remove()
  })

  // // 2.5 秒後自動漸漸消失
  // setTimeout(() => {
  //   dialog.classList.add("fade-out") // 添加淡出效果
  //   setTimeout(() => {
  //     dialog.close()
  //     dialog.remove()
  //   }, 1000) // 淡出動畫的持續時間
  // }, 2500)
}

// ===== 檢查是否所有卡片都已翻開 =====
function checkAllCardsOpened() {
  const remainingCards = document.querySelectorAll(".card-close")
  // 所有卡片已翻開，顯示結束提示
  if (remainingCards.length === 0) {
    setTimeout(() => {
      showEndDialog()
    }, 1000)
  }
}

// ===== 顯示結束提示訊息 =====
function showEndDialog() {
  const dialog = document.createElement("dialog")
  dialog.classList.add("end-dialog")
  dialog.innerHTML = `
    <img src="./img/end.svg">
    <p>~ 結束囉 ~</p>
    <p>~ 祝大家聖誕快樂 ~</p>
  `
  document.body.appendChild(dialog)
  dialog.showModal()

  // 2.5 秒後自動關閉提示視窗
  setTimeout(() => {
    dialog.classList.add("fade-out") // 添加淡出效果
    setTimeout(() => {
      dialog.close()
      dialog.remove()
    }, 1000) // 淡出動畫的持續時間
  }, 2500)
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

  // 1.8 秒後 -> 移除 loading、生成卡片
  setTimeout(() => {
    loadingDiv.remove() // 移除 loading 動畫
    generateCards(numberOfPeople, cardsDiv) // 生成卡片
    shuffleCards(cardsDiv) // 洗牌
    addResetButton() // 添加重置按鈕

    // 1 秒後 -> 觸發第一張卡片點擊事件
    setTimeout(() => {
      const allCards = document.querySelectorAll(".card-close")
      allCards[0].click()

      // 1.5 秒後 -> 顯示開始提示訊息
      setTimeout(() => {
        const cardNumber = allCards[0].textContent
        showStartMessage(cardNumber)
      }, 1500)

    }, 1000)

  }, 1800)
})