//////////////////////////////////////////////// preloader
document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  body.classList.add("loading");
});

window.addEventListener("load", function () {
  const body = document.querySelector("body");
  body.classList.remove("loading");
  body.classList.add("loaded");
});
////////////////////////////////////////////////

function saveLocal(itemName, items) {
  localStorage.setItem(itemName, JSON.stringify(items));
}

function getLocal(itemName) {
  const data = JSON.parse(localStorage.getItem(itemName));
  if (data) return data;
}

function deleteLocal(itemName) {
  localStorage.removeItem(itemName);
}

const boxesContainerEl = document.querySelector(".boxes");
const editFormEl = document.querySelector(".edit-box-form");
const cancelEditFormBtnEl = editFormEl.querySelector(".cancel-form");
const overlayEl = document.querySelector(".overlay");
let currentBox = null;
let operationType = null;

// Initial boxes:
let boxes = [
  {
    note: "السعرات الحرارية",
    num: 0,
    id: 1,
    type: "box-long",
    peakNum: 1150,
  },
  { note: "البروتين", num: 0, id: 2, notPeakNum: 136 },
  { note: "الكربوهيدرات", num: 0, id: 3, peakNum: 250 },
  { note: "الدهون", num: 0, id: 4, peakNum: 57 },
];

function createNewDay() {
  const newTime = new Date();

  const fullOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return newTime.toLocaleDateString("en-US", fullOptions);
}

function handleTime() {
  const lastDay = getLocal("lastDay");
  const newDay = createNewDay();
  // document.querySelector(".date").textContent = newDay;

  if (!lastDay) {
    saveLocal("lastDay", newDay);
    return;
  }

  if (lastDay === newDay) {
    return;
  }

  if (lastDay !== newDay) {
    saveLocal("boxes", boxes);
    saveLocal("lastDay", newDay);
    return;
  }
}

function handleChange(id, operation) {
  const index = boxes.findIndex((item) => item.id === id);
  operationType = operation;
  currentBox = boxes[index];
  openEditForm();
}

function reloadBoxes() {
  if (!boxes) return;
  boxesContainerEl.innerHTML = "";

  boxes.map((box) => {
    const markup = `
          <div class="box ${box.type ? box.type : ""}" id="${box.id}">
            <div class="box__info">
              <span class="box__info-note">
              ${box.note}
              </span>
              <span class="box__info-number ${
                ""
                // box.num !== 0 &&
                // box.peakNum &&
                // (box.num <= box.peakNum ? "green" : "red")
              }
              ${
                ""
                // box.num !== 0 &&
                // box.notPeakNum &&
                // (box.num >= box.notPeakNum ? "green" : "red")
              }
              ">
              ${box.num}
              </span>
            </div>
            <div class="box__calc">
              <button class="box__calc-minus">-</button>
              <button class="box__calc-plus">+</button>
            </div>
          </div>
          `;
    boxesContainerEl.insertAdjacentHTML("beforeend", markup);

    const boxEl = document.getElementById(box.id);
    const boxInc = boxEl.querySelector(".box__calc-plus");
    const boxDec = boxEl.querySelector(".box__calc-minus");

    boxInc.addEventListener("click", () => handleChange(box.id, "inc"));
    boxDec.addEventListener("click", () => handleChange(box.id, "dec"));
  });
}

// function resetHandler() {
//   document.querySelector(".reset-btn").addEventListener("click", function () {
//     deleteLocal("boxes");
//     location.reload();
//   });
// }

function openEditForm() {
  editFormEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
}

function closeEditForm() {
  editFormEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
}

editFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = e.target[0].value;
  const index = boxes.findIndex((item) => item.id === currentBox.id);

  if (operationType === "inc") {
    boxes[index].num += +val;
  }

  if (operationType === "dec") {
    boxes[index].num -= +val;
  }

  editFormEl.querySelector("input").value = "";
  reloadBoxes();
  closeEditForm();
  saveLocal("boxes", boxes);
});

cancelEditFormBtnEl.addEventListener("click", closeEditForm);
overlayEl.addEventListener("click", closeEditForm);

function init() {
  handleTime();

  const oldBoxes = getLocal("boxes");
  if (!oldBoxes) {
    saveLocal("boxes", boxes);
  } else {
    boxes = oldBoxes;
  }

  reloadBoxes();
  // resetHandler();
}

document.addEventListener("DOMContentLoaded", init);
