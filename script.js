// =========================================================
// 한끼로그 script.js
// 5주차: 알림 신청 폼 / 6주차: 예산 계산기·탭 / 7주차: 식단 만들기 흐름
// =========================================================

// ---------- 공통 데이터 ----------
const GOAL_LABELS = {
  save: "절약형",
  quick: "간편형",
  hearty: "든든형"
};

// 메뉴 데이터: 1인분 예상 비용(원), 조리 시간(분), 들어가는 재료
const MENUS = [
  { id: "egg-rice", name: "계란볶음밥", cost: 2000, time: 10, protein: false, ingredients: ["밥", "계란", "대파", "간장"] },
  { id: "kimchi-stew", name: "김치찌개", cost: 3500, time: 25, protein: true, ingredients: ["김치", "돼지고기", "두부", "대파"] },
  { id: "tuna-mayo", name: "참치마요덮밥", cost: 2500, time: 10, protein: true, ingredients: ["밥", "참치캔", "마요네즈", "김"] },
  { id: "soybean-stew", name: "된장찌개", cost: 3000, time: 20, protein: true, ingredients: ["된장", "두부", "애호박", "양파"] },
  { id: "tomato-egg", name: "토마토달걀볶음", cost: 2500, time: 10, protein: false, ingredients: ["토마토", "계란", "대파"] },
  { id: "jeyuk", name: "제육볶음", cost: 4500, time: 25, protein: true, ingredients: ["돼지고기", "양파", "고추장", "대파"] },
  { id: "tofu-jeon", name: "두부부침", cost: 1800, time: 15, protein: true, ingredients: ["두부", "계란", "간장"] },
  { id: "curry", name: "양파카레", cost: 3000, time: 30, protein: false, ingredients: ["카레가루", "양파", "감자", "당근"] },
  { id: "soy-egg-rice", name: "간장계란밥", cost: 1200, time: 5, protein: false, ingredients: ["밥", "계란", "간장", "참기름"] },
  { id: "kimchi-rice", name: "김치볶음밥", cost: 2200, time: 15, protein: false, ingredients: ["김치", "밥", "계란", "대파"] }
];

function formatWon(value) {
  return value.toLocaleString("ko-KR") + "원";
}

// 사용자가 입력한 글자를 HTML로 넣기 전에 특수문자를 바꿔 화면이 깨지지 않게 한다
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// =========================================================
// 5주차: 새 메뉴 알림 신청 (폼 제출 → 조건 검사 → 문구·스타일·버튼 상태 변경)
// =========================================================
const subscribeForm = document.querySelector("#subscribeForm");
const emailInput = document.querySelector("#email");
const subscribeBtn = document.querySelector("#subscribeBtn");
const subscribeMsg = document.querySelector("#subscribeMsg");

function setMessage(element, text, type) {
  element.textContent = text;
  element.classList.remove("is-error", "is-success", "is-info");
  if (type) {
    element.classList.add("is-" + type);
  }
}

subscribeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    setMessage(subscribeMsg, "이메일 주소를 입력해 주세요.", "error");
    emailInput.classList.add("is-invalid");
    emailInput.focus();
  } else if (!emailPattern.test(email)) {
    setMessage(subscribeMsg, "이메일 형식이 올바르지 않아요. 예: example@email.com", "error");
    emailInput.classList.add("is-invalid");
    emailInput.focus();
  } else {
    setMessage(subscribeMsg, email + " 주소로 매주 월요일 새 메뉴를 보내 드릴게요.", "success");
    emailInput.classList.remove("is-invalid");
    subscribeBtn.textContent = "신청 완료";
    subscribeBtn.disabled = true;
    emailInput.disabled = true;
  }
});

// =========================================================
// 6주차: 한 끼 예산 계산기 (input · change · click 이벤트)
// =========================================================
const calcBudget = document.querySelector("#calcBudget");
const calcMeals = document.querySelector("#calcMeals");
const calcResult = document.querySelector("#calcResult");
const calcStartBtn = document.querySelector("#calcStartBtn");

function updateCalculator() {
  const budget = Number(calcBudget.value);
  const meals = Number(calcMeals.value);
  calcResult.classList.remove("is-good", "is-warn");

  if (!calcBudget.value || budget <= 0) {
    calcResult.textContent = "주간 식비를 입력해 주세요.";
    calcStartBtn.disabled = true;
    return;
  }

  const perMeal = Math.floor(budget / meals);
  if (perMeal < 1500) {
    calcResult.textContent = "한 끼 " + formatWon(perMeal) + " · 조금 빠듯해요. 끼니 수를 줄이거나 예산을 늘려 보세요.";
    calcResult.classList.add("is-warn");
  } else {
    calcResult.textContent = "한 끼 " + formatWon(perMeal) + " · 충분히 해 먹을 수 있는 예산이에요!";
    calcResult.classList.add("is-good");
  }
  calcStartBtn.disabled = false;
}

calcBudget.addEventListener("input", updateCalculator);
calcMeals.addEventListener("change", updateCalculator);

// 계산기 값을 식단 만들기 2단계에 채워 주고 이동
calcStartBtn.addEventListener("click", function () {
  document.querySelector("#weekBudget").value = calcBudget.value;
  document.querySelector("#mealCount").value = calcMeals.value;
  document.querySelector("#planner").scrollIntoView({ behavior: "smooth" });
  setMessage(stepMessage(1), "계산기에서 입력한 예산과 끼니 수를 2단계에 미리 채워 두었어요. 목표를 먼저 골라 주세요.", "info");
});

// 탭 UI: 선택한 탭만 강조하고 해당 콘텐츠만 보이기
const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const target = button.dataset.tab;
    tabButtons.forEach(function (other) {
      const isTarget = other === button;
      other.classList.toggle("is-active", isTarget);
      other.setAttribute("aria-selected", String(isTarget));
      document.querySelector("#tab-" + other.dataset.tab).hidden = !isTarget;
    });
  });
});

// =========================================================
// 7주차: 일주일 식단 만들기 흐름
// 시작(목표) → 입력(예산·끼니) → 선택(메뉴) → 확인 → 완료
// =========================================================
const plan = {
  goal: "",
  nickname: "",
  budget: 0,
  meals: 0,
  menus: [], // 선택한 메뉴 id 목록
  fridge: [] // 중간고사: 냉장고에 있다고 입력한 재료 목록
};
let currentStep = 1;

const nicknameInput = document.querySelector("#nickname");
const weekBudgetInput = document.querySelector("#weekBudget");
const mealCountSelect = document.querySelector("#mealCount");
const menuList = document.querySelector("#menuList");
const menuGuide = document.querySelector("#menuGuide");
const budgetBar = document.querySelector("#budgetBar");
const summary = document.querySelector("#summary");

function stepMessage(step) {
  return document.querySelector('[data-msg="' + step + '"]');
}

function showStep(step) {
  currentStep = step;
  document.querySelectorAll(".step").forEach(function (panel) {
    panel.hidden = Number(panel.dataset.step) !== step;
  });
  document.querySelectorAll(".step-dot").forEach(function (dot) {
    const dotStep = Number(dot.dataset.stepDot);
    dot.classList.toggle("is-current", dotStep === step);
    dot.classList.toggle("is-done", dotStep < step);
  });
  if (step === 3) {
    renderMenus();
    // 중간고사: 이전 단계에서 끼니 수·예산을 바꾸고 돌아오면 찾기 결과도 새 값으로 다시 계산
    if (hasSearched) {
      renderFridgeResults();
    }
  }
  if (step === 4) {
    renderSummary();
  }
}

// 목표에 맞는 메뉴인지 판단
function matchesGoal(menu, goal) {
  if (goal === "save") return menu.cost <= 2500;
  if (goal === "quick") return menu.time <= 15;
  if (goal === "hearty") return menu.protein;
  return false;
}

function getMenu(id) {
  return MENUS.find(function (menu) {
    return menu.id === id;
  });
}

function getTotalCost() {
  return plan.menus.reduce(function (sum, id) {
    return sum + getMenu(id).cost;
  }, 0);
}

// 3단계 메뉴 목록: 목표에 맞는 메뉴를 위로 정렬하고, 이전에 고른 메뉴는 체크 유지
function renderMenus() {
  const sorted = MENUS.slice().sort(function (a, b) {
    return Number(matchesGoal(b, plan.goal)) - Number(matchesGoal(a, plan.goal));
  });

  menuGuide.textContent = GOAL_LABELS[plan.goal] + " 목표에 맞는 메뉴가 위에 표시돼요. 1개 이상, 최대 " + plan.meals + "개까지 고를 수 있어요.";
  menuList.innerHTML = "";

  sorted.forEach(function (menu) {
    const item = document.createElement("li");
    const checked = plan.menus.includes(menu.id) ? "checked" : "";
    const badge = matchesGoal(menu, plan.goal) ? '<span class="badge badge-goal">' + GOAL_LABELS[plan.goal] + "</span>" : "";
    item.innerHTML =
      '<label class="menu-item">' +
      '<input type="checkbox" value="' + menu.id + '" ' + checked + ">" +
      "<span>" +
      '<span class="menu-name">' + menu.name + "</span>" + badge +
      '<span class="menu-meta">' + formatWon(menu.cost) + " · " + menu.time + "분</span>" +
      "</span>" +
      "</label>";
    menuList.appendChild(item);
  });

  updateBudgetBar();
}

// 체크 상태가 바뀌면 선택 목록과 예산 막대를 바로 갱신
menuList.addEventListener("change", function (event) {
  if (event.target.type !== "checkbox") return;
  const id = event.target.value;
  if (event.target.checked) {
    plan.menus.push(id);
  } else {
    plan.menus = plan.menus.filter(function (menuId) {
      return menuId !== id;
    });
  }
  setMessage(stepMessage(3), "");
  updateBudgetBar();
  // 찾기 결과가 열려 있으면 "담김" 표시도 함께 맞춘다
  if (hasSearched) {
    renderFridgeResults();
  }
});

function updateBudgetBar() {
  const total = getTotalCost();
  const left = plan.budget - total;
  budgetBar.classList.toggle("is-over", left < 0);
  if (left < 0) {
    budgetBar.textContent = "선택 " + plan.menus.length + "/" + plan.meals + "개 · 예상 " + formatWon(total) + " · 예산보다 " + formatWon(-left) + " 많아요";
  } else {
    budgetBar.textContent = "선택 " + plan.menus.length + "/" + plan.meals + "개 · 예상 " + formatWon(total) + " · 남는 예산 " + formatWon(left);
  }
}

// 단계별 필수값 검사: 통과하면 true, 아니면 수정 방법을 안내하고 false
function validateStep(step) {
  const msg = stepMessage(step);

  if (step === 1) {
    const checked = document.querySelector('input[name="goal"]:checked');
    if (!checked) {
      setMessage(msg, "식단 목표를 하나 골라 주세요. 잘 모르겠다면 '절약형'부터 시작해 보세요.", "error");
      return false;
    }
    plan.goal = checked.value;
  }

  if (step === 2) {
    const nickname = nicknameInput.value.trim();
    const budget = Number(weekBudgetInput.value);
    [nicknameInput, weekBudgetInput, mealCountSelect].forEach(function (field) {
      field.classList.remove("is-invalid");
    });

    if (nickname.length < 2) {
      setMessage(msg, "닉네임을 2~10자로 입력해 주세요.", "error");
      nicknameInput.classList.add("is-invalid");
      nicknameInput.focus();
      return false;
    }
    if (!weekBudgetInput.value || budget < 10000 || budget > 200000) {
      setMessage(msg, "주간 식비는 10,000원에서 200,000원 사이 숫자로 입력해 주세요.", "error");
      weekBudgetInput.classList.add("is-invalid");
      weekBudgetInput.focus();
      return false;
    }
    if (mealCountSelect.value === "") {
      setMessage(msg, "직접 해 먹을 끼니 수를 선택해 주세요.", "error");
      mealCountSelect.classList.add("is-invalid");
      mealCountSelect.focus();
      return false;
    }

    plan.nickname = nickname;
    plan.budget = budget;
    plan.meals = Number(mealCountSelect.value);

    // 끼니 수를 줄여 이미 고른 메뉴가 더 많아지면 넘치는 메뉴는 뒤에서부터 뺀다
    if (plan.menus.length > plan.meals) {
      plan.menus = plan.menus.slice(0, plan.meals);
    }
  }

  if (step === 3) {
    if (plan.menus.length === 0) {
      setMessage(msg, "메뉴를 1개 이상 골라 주세요.", "error");
      return false;
    }
    if (plan.menus.length > plan.meals) {
      setMessage(msg, "끼니 수(" + plan.meals + "끼)보다 많이 골랐어요. " + (plan.menus.length - plan.meals) + "개를 빼 주세요.", "error");
      return false;
    }
    if (getTotalCost() > plan.budget) {
      setMessage(msg, "예산을 " + formatWon(getTotalCost() - plan.budget) + " 넘었어요. 비싼 메뉴를 빼거나 2단계에서 예산을 늘려 주세요.", "error");
      return false;
    }
  }

  if (msg) {
    setMessage(msg, "");
  }
  return true;
}

// 4단계 확인 화면: 입력·선택 값을 보여 주고 단계별 수정 버튼 제공
function renderSummary() {
  const total = getTotalCost();
  const menuNames = plan.menus.map(function (id) {
    return getMenu(id).name;
  }).join(", ");

  summary.innerHTML =
    "<dt>목표</dt><dd>" + GOAL_LABELS[plan.goal] + '</dd><dd><button class="btn btn-ghost btn-small" type="button" data-edit="1">수정</button></dd>' +
    "<dt>닉네임</dt><dd>" + escapeHtml(plan.nickname) + '</dd><dd><button class="btn btn-ghost btn-small" type="button" data-edit="2">수정</button></dd>' +
    "<dt>주간 식비 · 끼니</dt><dd>" + formatWon(plan.budget) + " · " + plan.meals + '끼</dd><dd><button class="btn btn-ghost btn-small" type="button" data-edit="2">수정</button></dd>' +
    "<dt>메뉴 (" + plan.menus.length + "개)</dt><dd>" + menuNames + '</dd><dd><button class="btn btn-ghost btn-small" type="button" data-edit="3">수정</button></dd>' +
    "<dt>예상 비용</dt><dd>" + formatWon(total) + " (남는 예산 " + formatWon(plan.budget - total) + ")</dd><dd></dd>" +
    "<dt>장보기 목록</dt><dd>" + getShoppingText() + '</dd><dd><button class="btn btn-ghost btn-small" type="button" data-edit="fridge">재료 수정</button></dd>';
}

// 수정 버튼: 해당 단계로 이동 (입력값은 그대로 유지)
summary.addEventListener("click", function (event) {
  const editStep = event.target.dataset.edit;
  if (editStep === "fridge") {
    // 장보기 목록의 "재료 수정": 3단계로 가서 냉장고 재료 찾기 패널을 바로 연다
    showStep(3);
    openFridgePanel();
    return;
  }
  if (editStep) {
    showStep(Number(editStep));
  }
});

// 다음 버튼
document.querySelectorAll("[data-next]").forEach(function (button) {
  button.addEventListener("click", function () {
    const step = Number(button.dataset.next);
    if (!validateStep(step)) return;

    if (step === 4) {
      document.querySelector("#doneTitle").textContent = plan.nickname + "님의 일주일 식단 계획이 완성되었어요";
      document.querySelector("#doneText").textContent =
        GOAL_LABELS[plan.goal] + " · 메뉴 " + plan.menus.length + "개 · 예상 비용 " + formatWon(getTotalCost()) + " · 이번 주 식비 " + formatWon(plan.budget) + " 안에서 지킬 수 있어요.";
      renderDoneShopping();
    }
    showStep(step + 1);
  });
});

// 이전 버튼: 값은 지우지 않고 화면만 이동
document.querySelectorAll("[data-prev]").forEach(function (button) {
  button.addEventListener("click", function () {
    showStep(Number(button.dataset.prev) - 1);
  });
});

// 처음부터 다시: 흐름의 입력·선택·오류·진행 상태 초기화
function resetPlanner() {
  plan.goal = "";
  plan.nickname = "";
  plan.budget = 0;
  plan.meals = 0;
  plan.menus = [];

  document.querySelectorAll('input[name="goal"]').forEach(function (radio) {
    radio.checked = false;
  });
  nicknameInput.value = "";
  weekBudgetInput.value = "";
  mealCountSelect.value = "";
  [nicknameInput, weekBudgetInput, mealCountSelect].forEach(function (field) {
    field.classList.remove("is-invalid");
  });
  [1, 2, 3].forEach(function (step) {
    setMessage(stepMessage(step), "");
  });
  menuList.innerHTML = "";
  summary.innerHTML = "";
  resetFridge();
  showStep(1);
}

document.querySelector("#restartBtn").addEventListener("click", function () {
  resetPlanner();
  document.querySelector("#planner").scrollIntoView({ behavior: "smooth" });
});

// =========================================================
// 중간고사: 냉장고 재료로 메뉴 찾기
// 3단계(메뉴 선택) 중간에 연결되는 새 경로
// 재료 추가 → 메뉴 찾기 → (결과 있음) 계획에 담기 / (결과 없음) 재료 추가·전체 메뉴로 / (취소) 목록으로
// 담은 메뉴의 부족한 재료는 4단계 확인·5단계 완료의 장보기 목록에 반영된다
// =========================================================
const MAX_FRIDGE = 8;
const INGREDIENT_PATTERN = /^[가-힣a-zA-Z]{1,10}$/;

const fridgeEntry = document.querySelector("#fridgeEntry");
const fridgeOpenBtn = document.querySelector("#fridgeOpenBtn");
const fridgePanel = document.querySelector("#fridgePanel");
const fridgeInput = document.querySelector("#fridgeInput");
const fridgeAddBtn = document.querySelector("#fridgeAddBtn");
const fridgeChips = document.querySelector("#fridgeChips");
const fridgeMsg = document.querySelector("#fridgeMsg");
const fridgeSearchBtn = document.querySelector("#fridgeSearchBtn");
const fridgeCancelBtn = document.querySelector("#fridgeCancelBtn");
const fridgeClearBtn = document.querySelector("#fridgeClearBtn");
const fridgeResults = document.querySelector("#fridgeResults");

let hasSearched = false; // 메뉴 찾기를 한 번이라도 눌러 결과를 보여 주는 중인지

function openFridgePanel() {
  fridgePanel.hidden = false;
  fridgeEntry.hidden = true;
  fridgeOpenBtn.setAttribute("aria-expanded", "true");
  setMessage(stepMessage(3), "");
  fridgeInput.focus();
}

function closeFridgePanel() {
  fridgePanel.hidden = true;
  fridgeEntry.hidden = false;
  fridgeOpenBtn.setAttribute("aria-expanded", "false");
  fridgeResults.innerHTML = "";
  setMessage(fridgeMsg, "");
  hasSearched = false;
}

// 추가한 재료를 칩으로 표시 (✕로 하나씩 뺄 수 있음)
function renderFridgeChips() {
  fridgeChips.innerHTML = "";
  plan.fridge.forEach(function (name) {
    const chip = document.createElement("li");
    chip.className = "chip";
    chip.innerHTML =
      "<span>" + escapeHtml(name) + "</span>" +
      '<button class="chip-remove" type="button" data-remove="' + escapeHtml(name) + '" aria-label="' + escapeHtml(name) + ' 빼기">✕</button>';
    fridgeChips.appendChild(chip);
  });
  fridgeSearchBtn.textContent = plan.fridge.length > 0 ? "메뉴 찾기 (재료 " + plan.fridge.length + "개)" : "메뉴 찾기";
  // 이미 넣은 자주 쓰는 재료 버튼은 비활성화
  document.querySelectorAll(".quick-chip").forEach(function (button) {
    button.disabled = hasIngredient(button.dataset.ingredient);
  });
}

// 영문은 대소문자를 구분하지 않고 같은 재료인지 확인 (Egg = egg)
function hasIngredient(name) {
  return plan.fridge.some(function (item) {
    return item.toLowerCase() === name.toLowerCase();
  });
}

// 재료 추가: 빈 값·형식·중복·개수 조건을 확인하고 고치는 방법을 안내
function addIngredient(rawName) {
  const name = rawName.trim();
  fridgeInput.classList.remove("is-invalid");

  if (name === "") {
    setMessage(fridgeMsg, "재료 이름을 입력해 주세요. 예: 계란, 양파", "error");
    fridgeInput.classList.add("is-invalid");
    fridgeInput.focus();
    return;
  }
  if (!INGREDIENT_PATTERN.test(name)) {
    setMessage(fridgeMsg, "재료 이름은 숫자·기호·띄어쓰기 없이 한글이나 영문 1~10자로 입력해 주세요. 예: 돼지고기", "error");
    fridgeInput.classList.add("is-invalid");
    fridgeInput.focus();
    return;
  }
  if (hasIngredient(name)) {
    setMessage(fridgeMsg, "'" + name + "'은(는) 이미 추가한 재료예요. 다른 재료를 입력해 주세요.", "error");
    fridgeInput.select();
    return;
  }
  if (plan.fridge.length >= MAX_FRIDGE) {
    setMessage(fridgeMsg, "재료는 최대 " + MAX_FRIDGE + "개까지 넣을 수 있어요. 덜 중요한 재료를 ✕로 뺀 뒤 추가해 주세요.", "error");
    return;
  }

  plan.fridge.push(name);
  fridgeInput.value = "";
  fridgeInput.focus();
  renderFridgeChips();
  setMessage(fridgeMsg, "'" + name + "'을(를) 추가했어요 (" + plan.fridge.length + "/" + MAX_FRIDGE + "). 다 넣었다면 메뉴 찾기를 누르세요.", "info");
  // 재료가 바뀌었으니 이전 찾기 결과는 다시 계산한다
  if (hasSearched) {
    renderFridgeResults();
  }
}

// 재료로 만들 수 있는 메뉴 계산: 가진 재료가 1개 이상 들어가는 메뉴만, 부족한 재료가 적은 순
function findMenusByFridge() {
  return MENUS
    .map(function (menu) {
      const owned = menu.ingredients.filter(function (item) {
        return plan.fridge.includes(item);
      });
      const missing = menu.ingredients.filter(function (item) {
        return !plan.fridge.includes(item);
      });
      return { menu: menu, owned: owned, missing: missing };
    })
    .filter(function (result) {
      return result.owned.length > 0;
    })
    .sort(function (a, b) {
      return a.missing.length - b.missing.length || b.owned.length - a.owned.length || a.menu.cost - b.menu.cost;
    });
}

// 찾기 결과 화면: 성공 / 결과 없음 상태를 나눠 보여 준다
function renderFridgeResults() {
  hasSearched = true;
  const results = findMenusByFridge();
  const perMeal = Math.floor(plan.budget / plan.meals);
  fridgeResults.innerHTML = "";

  if (results.length === 0) {
    const empty = document.createElement("li");
    empty.className = "result-empty";
    empty.innerHTML =
      "<p><strong>" + escapeHtml(plan.fridge.join(", ")) + "</strong>(으)로 만들 수 있는 메뉴가 아직 없어요.</p>" +
      "<p>위의 자주 쓰는 재료를 더 추가하거나, 찾기를 닫고 전체 메뉴에서 직접 골라 주세요.</p>" +
      '<button class="btn btn-ghost btn-small" type="button" data-action="browse-all">전체 메뉴에서 고르기</button>';
    fridgeResults.appendChild(empty);
    setMessage(fridgeMsg, "검색 결과가 없어요. 재료 이름이 정확한지 확인해 보세요. (예: 고기 → 돼지고기)", "info");
    return;
  }

  results.forEach(function (result) {
    const menu = result.menu;
    const isAdded = plan.menus.includes(menu.id);
    const budgetBadge = menu.cost <= perMeal
      ? '<span class="badge badge-ok">1끼 예산 안</span>'
      : '<span class="badge badge-over">1끼 예산 초과</span>';
    const missingText = result.missing.length === 0
      ? '<span class="result-ready">재료가 모두 있어요!</span>'
      : '<span class="result-missing">더 필요: ' + result.missing.join(", ") + "</span>";

    const item = document.createElement("li");
    item.className = "result-item" + (isAdded ? " is-added" : "");
    item.innerHTML =
      '<div class="result-info">' +
      '<span class="menu-name">' + menu.name + "</span>" + budgetBadge +
      '<span class="result-detail">가진 재료 ' + result.owned.length + "/" + menu.ingredients.length + " (" + result.owned.join(", ") + ") · " + formatWon(menu.cost) + " · " + menu.time + "분</span>" +
      '<span class="result-detail">' + missingText + "</span>" +
      "</div>" +
      '<button class="btn btn-small ' + (isAdded ? "btn-ghost" : "btn-primary") + '" type="button" data-add-menu="' + menu.id + '"' + (isAdded ? " disabled" : "") + ">" +
      (isAdded ? "담김 ✓" : "계획에 담기") +
      "</button>";
    fridgeResults.appendChild(item);
  });

  setMessage(fridgeMsg, "만들 수 있는 메뉴 " + results.length + "개를 찾았어요. 부족한 재료가 적은 순서예요. 원하는 메뉴를 계획에 담아 주세요.", "success");
}

// 찾은 메뉴를 계획에 담기: 끼니 수를 넘지 않을 때만 담고 3단계 목록·예산 막대에 반영
function addMenuFromFridge(id) {
  const menu = getMenu(id);
  if (plan.menus.includes(id)) {
    return;
  }
  if (plan.menus.length >= plan.meals) {
    setMessage(fridgeMsg, "이미 끼니 수(" + plan.meals + "끼)만큼 골랐어요. 아래 전체 메뉴에서 하나를 체크 해제한 뒤 다시 담아 주세요.", "error");
    return;
  }

  plan.menus.push(id);
  renderMenus();
  renderFridgeResults();

  const total = getTotalCost();
  if (total > plan.budget) {
    setMessage(fridgeMsg, menu.name + "을(를) 담았지만 예산을 " + formatWon(total - plan.budget) + " 넘었어요. 다른 메뉴를 빼야 다음 단계로 갈 수 있어요.", "error");
  } else {
    setMessage(fridgeMsg, menu.name + "을(를) 계획에 담았어요. 부족한 재료는 확인 화면의 장보기 목록에 들어가요.", "success");
  }
  // 목록을 다시 그려 누른 버튼이 사라졌으므로, 결과 안내 문구로 포커스를 옮겨 바로 읽히게 한다
  fridgeMsg.focus();
}

// 장보기 목록: 선택한 메뉴에 필요한 재료 중 냉장고에 없는 재료
function getShoppingList() {
  const list = [];
  plan.menus.forEach(function (id) {
    getMenu(id).ingredients.forEach(function (item) {
      if (!plan.fridge.includes(item) && !list.includes(item)) {
        list.push(item);
      }
    });
  });
  return list;
}

function getShoppingText() {
  const list = getShoppingList();
  if (list.length === 0) {
    return "냉장고 재료로 모두 만들 수 있어요. 장 볼 필요가 없어요!";
  }
  const note = plan.fridge.length > 0 ? " (냉장고 재료 " + plan.fridge.length + "개 제외)" : "";
  return list.join(", ") + note;
}

function renderDoneShopping() {
  const list = getShoppingList();
  const doneShopping = document.querySelector("#doneShopping");
  const note = document.querySelector("#doneShoppingNote");
  doneShopping.innerHTML = "";

  if (list.length === 0) {
    note.textContent = "냉장고에 있는 재료로 이번 주 메뉴를 모두 만들 수 있어요.";
    return;
  }
  note.textContent = plan.fridge.length > 0
    ? "냉장고에 있는 " + plan.fridge.join(", ") + "은(는) 빼고, 부족한 재료만 모았어요."
    : "냉장고 재료를 입력하지 않아 메뉴에 필요한 재료를 모두 담았어요.";
  list.forEach(function (item) {
    const li = document.createElement("li");
    li.textContent = item;
    doneShopping.appendChild(li);
  });
}

// 다시 시작할 때 이 기능의 상태도 함께 초기화
function resetFridge() {
  plan.fridge = [];
  fridgeInput.value = "";
  fridgeInput.classList.remove("is-invalid");
  renderFridgeChips();
  closeFridgePanel();
}

// ----- 이벤트 연결 -----
fridgeOpenBtn.addEventListener("click", openFridgePanel);

fridgeAddBtn.addEventListener("click", function () {
  addIngredient(fridgeInput.value);
});

// 입력창에서 Enter를 눌러도 재료가 추가되도록
fridgeInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addIngredient(fridgeInput.value);
  }
});

document.querySelectorAll(".quick-chip").forEach(function (button) {
  button.addEventListener("click", function () {
    addIngredient(button.dataset.ingredient);
  });
});

fridgeChips.addEventListener("click", function (event) {
  const name = event.target.dataset.remove;
  if (!name) return;
  plan.fridge = plan.fridge.filter(function (item) {
    return item !== name;
  });
  renderFridgeChips();
  fridgeInput.focus();
  if (plan.fridge.length === 0) {
    fridgeResults.innerHTML = "";
    hasSearched = false;
    setMessage(fridgeMsg, "재료를 모두 뺐어요. 다시 찾으려면 재료를 추가해 주세요.", "info");
  } else if (hasSearched) {
    renderFridgeResults();
  } else {
    setMessage(fridgeMsg, "'" + name + "'을(를) 뺐어요.", "info");
  }
});

fridgeSearchBtn.addEventListener("click", function () {
  if (plan.fridge.length === 0) {
    setMessage(fridgeMsg, "재료를 1개 이상 추가한 뒤 메뉴 찾기를 눌러 주세요. 자주 쓰는 재료 버튼을 눌러도 돼요.", "error");
    fridgeInput.focus();
    return;
  }
  renderFridgeResults();
  // 모바일에서는 결과가 버튼 아래 화면 밖에 생기므로 결과 위치로 이동
  fridgeResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

fridgeResults.addEventListener("click", function (event) {
  if (event.target.dataset.addMenu) {
    addMenuFromFridge(event.target.dataset.addMenu);
  }
  if (event.target.dataset.action === "browse-all") {
    closeFridgePanel();
    setMessage(stepMessage(3), "아래 전체 메뉴에서 직접 골라 주세요. 입력한 재료는 장보기 목록 계산에 그대로 쓰여요.", "info");
    const firstMenu = menuList.querySelector("input");
    if (firstMenu) {
      firstMenu.focus();
    }
  }
});

// 취소: 찾기 화면만 닫고 이미 담은 메뉴와 입력한 재료는 유지
fridgeCancelBtn.addEventListener("click", function () {
  closeFridgePanel();
  setMessage(stepMessage(3), "재료로 찾기를 닫았어요. 이미 담은 메뉴와 입력한 재료는 그대로 남아 있어요.", "info");
  fridgeOpenBtn.focus();
});

// 재료 모두 지우기: 이 기능 안의 재료·결과만 초기화 (담은 메뉴는 유지)
fridgeClearBtn.addEventListener("click", function () {
  plan.fridge = [];
  fridgeInput.value = "";
  fridgeInput.classList.remove("is-invalid");
  fridgeResults.innerHTML = "";
  hasSearched = false;
  renderFridgeChips();
  setMessage(fridgeMsg, "입력한 재료를 모두 지웠어요. 새로 재료를 추가해 주세요.", "info");
  fridgeInput.focus();
});
