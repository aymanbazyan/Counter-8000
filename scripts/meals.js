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

const mealDetails = document.querySelector(".meal-details");
const mealDetailsInfo = document.querySelector(".meal-details__info");
const mealDetailsEatBtn = mealDetails.querySelector(".meal-details__btns-eat");
const mealDetailsCancelBtn = mealDetails.querySelector(
  ".meal-details__btns-cancel"
);
const mealDetailsDeleteBtn = mealDetails.querySelector(
  ".meal-details__btns-delete"
);

const mealsContainerEl = document.querySelector(".meals");
const addMealBtn = document.querySelector(".add-meal-btn");
const overlayEl = document.querySelector(".overlay");
const addMealFormEl = document.querySelector(".add-meal__form");
const cancelAddMealFormEl = addMealFormEl.querySelector(".cancel-form");
let mealsEl, currentDetailedMeal;

// Initial meals
let meals = [];
const boxes = getLocal("boxes");

function openAddMealForm() {
  addMealFormEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
}

function closeAddMealForm() {
  addMealFormEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
}

function openMealDetails() {
  mealDetails.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
}

function closeMealDetails() {
  mealDetails.classList.add("hidden");
  overlayEl.classList.add("hidden");
}

function changeDetails(id) {
  const meal = meals.find((meal) => meal.id === id);
  currentDetailedMeal = meal;
  console.log(mealDetailsInfo.children);
  mealDetailsInfo.children[0].textContent = meal.name;
  mealDetailsInfo.children[1].textContent = meal.description;
  mealDetailsInfo.children[2].textContent = `السعرات: ${meal.calories}`;
  mealDetailsInfo.children[3].textContent = `البروتين: ${meal.protein}`;
  mealDetailsInfo.children[4].textContent = `الكربوهيدرات: ${meal.carbs}`;
  mealDetailsInfo.children[5].textContent = `الدهون: ${meal.fat}`;
}

function reloadMeals() {
  if (!meals) return;
  mealsContainerEl.innerHTML = "";
  meals.map((meal) => {
    // draggable="true"
    const markup = `
    <div class="meal" id="${meal.id}">
      <div class="meal__info">
        <p>${meal.name}</p>
        <p class="${
          "" // boxes[0].num + +meal.calories > boxes[0].peakNum ? "red" : "green"
        }">${meal.calories}</p>
      </div>
    </div>
        `;

    mealsContainerEl.insertAdjacentHTML("beforeend", markup);
    mealsEl = document.querySelectorAll(".meal");
  });

  // mealsEl?.forEach((meal) => {
  //   meal.addEventListener("dragstart", () => {
  //     meal.classList.add("meal-dragging");
  //   });

  //   meal.addEventListener("dragend", () => {
  //     meal.classList.remove("meal-dragging");

  //     // Get all the meal elements
  //     const [...children] = mealsContainerEl.children;

  //     // Create an array to store the sorted meals
  //     const sortedMeals = [];

  //     // Iterate through the meal elements and reorder the meals array
  //     children.forEach((child) => {
  //       const mealId = child.id;

  //       // Find the meal object in the original array by its id
  //       const foundMeal = meals.find((meal) => meal.id === mealId);

  //       // Add the found meal to the sortedMeals array
  //       if (foundMeal) {
  //         sortedMeals.push(foundMeal);
  //       }
  //     });

  //     // Update the meals array with the sortedMeals array
  //     meals = sortedMeals;
  //     saveLocal("meals", sortedMeals);
  //   });
  // });
}

// mealsContainerEl.addEventListener("dragover", (e) => {
//   e.preventDefault();
//   const afterElement = getDragAfterEl(mealsContainerEl, e.clientY);
//   const draggable = document.querySelector(".meal-dragging");

//   if (afterElement == null) {
//     mealsContainerEl.appendChild(draggable);
//   } else {
//     mealsContainerEl.insertBefore(draggable, afterElement);
//   }
// });

// function getDragAfterEl(container, y) {
//   const draggableElements = [
//     ...container.querySelectorAll(".meal:not(.meal-dragging)"),
//   ];

//   return draggableElements.reduce(
//     (closest, child) => {
//       const box = child.getBoundingClientRect();
//       const offset = y - box.top - box.height / 2;

//       if (offset < 0 && offset > closest.offset) {
//         return { offset, element: child };
//       } else {
//         return closest;
//       }
//     },
//     { offset: Number.NEGATIVE_INFINITY }
//   ).element;
// }

function listeners() {
  mealsContainerEl.addEventListener("click", (e) => {
    const target = e.target;
    console.log(target);
    // if (!target.classList.contains("meal")) return;
    changeDetails(target.closest(".meal").id);
    openMealDetails();
  });

  addMealBtn.addEventListener("click", () => {
    openAddMealForm();
  });

  overlayEl.addEventListener("click", () => {
    closeAddMealForm();
    closeMealDetails();
  });

  cancelAddMealFormEl.addEventListener("click", () => {
    closeAddMealForm();
  });

  mealDetailsCancelBtn.addEventListener("click", () => {
    closeMealDetails();
  });

  mealDetailsEatBtn.addEventListener("click", () => {
    const mealArr = [
      +currentDetailedMeal.calories,
      +currentDetailedMeal.protein,
      +currentDetailedMeal.carbs,
      +currentDetailedMeal.fat,
    ];

    for (let i = 0; i < boxes.length; i++) {
      boxes[i].num += mealArr[i];
    }

    saveLocal("boxes", boxes);
    reloadMeals();
    closeMealDetails();
  });

  addMealFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const newMeal = {
      name: e.target[0].value,
      id: new Date().getTime().toString(),
      description: e.target[1].value,
      calories: e.target[2].value,
      protein: e.target[3].value,
      carbs: e.target[4].value,
      fat: e.target[5].value,
    };
    meals.push(newMeal);
    saveLocal("meals", meals);
    reloadMeals();
    closeAddMealForm();
    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
    e.target[3].value = "";
    e.target[4].value = "";
    e.target[5].value = "";
  });

  mealDetailsDeleteBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this meal?")) return;

    const mealIndex = meals.findIndex(
      (meal) => meal.id === currentDetailedMeal.id
    );
    const updatedMeals = meals.filter((_, index) => index !== mealIndex);

    saveLocal("meals", updatedMeals);
    meals = updatedMeals;
    reloadMeals();
    closeMealDetails();
  });
}

function init() {
  const oldMeals = getLocal("meals");
  if (oldMeals) meals = oldMeals;

  listeners();

  reloadMeals();
}

document.addEventListener("DOMContentLoaded", init);
