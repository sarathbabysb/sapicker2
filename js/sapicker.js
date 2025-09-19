const sapickerMaterArr = [];
const sapicker = document.querySelectorAll(".sapicker");

// Build UI from sapickerMaterArr
const saPickerIteration = () => {
  sapickerMaterArr?.map((maItem, index) => {
    let saSubHtml = '';
    let activeItem = '<li>Select Option</li>';
    maItem.sapickerSubArr?.map((item, i) => {
      let imageTag = '';
      if (item.image) {
        imageTag = `<img src="${item.image}" alt="flag">`;
      }
      let itemTag = `<li data-master-index="${index}" data-option-index="${i}">${imageTag + item.text}</li>`;
      saSubHtml += itemTag;
      if (item.active) {
        activeItem = `<li>${imageTag + item.text}</li>`;
      }
    });
    let saMasterHtml =
      `<ul class="sapicker-selected sapicker-ul">${activeItem}</ul>` +
      `<ul class="sapicker-option sapicker-ul">${saSubHtml}</ul>`;
    const saChildDiv = document.createElement("div");
    saChildDiv.classList.add(`wrap-sapicker`);
    saChildDiv.setAttribute('id', `wrap-sapicker-${maItem.index}`);
    saChildDiv.innerHTML = saMasterHtml;
    document.getElementById(`sapicker-${maItem.index}`).appendChild(saChildDiv);
  });
};

// Initial render
const createDivs = (el) => {
  el.forEach((div, index) => {
    const sapickerSubArr = [];
    div.parentNode.setAttribute("id", `sapicker-${index}`);
    let options = div.querySelectorAll(".sapicker option");
    options.forEach(function (opt, i) {
      let img = opt.getAttribute("data-thumbnail");
      let text = opt.innerText;
      let value = opt.value;
      let selectedValue = div.value;
      let active = (value === selectedValue);
      sapickerSubArr.push({ index: i, image: img, text: text, value: value, active: active });
    });
    sapickerMaterArr.push({ index: index, sapickerSubArr: sapickerSubArr });
  });
  saPickerIteration();
};
createDivs(sapicker);

// Handle clicks
document.addEventListener("click", function (event) {
  let sapickerSelectedLi = event.target.closest(".sapicker-selected li");
  let sapickerOptionLi = event.target.closest(".sapicker-option li");
  if (sapickerSelectedLi) {
    let elmID = sapickerSelectedLi.parentNode.parentNode.getAttribute('id');
    let clickedElement = document.getElementById(elmID).querySelector(".sapicker-option");
    document.querySelectorAll(".sapicker-option").forEach((item) => {
      if (item != clickedElement) {
        item.classList.remove("sapicker-option-show");
      }
    });
    clickedElement.classList.toggle("sapicker-option-show");
  }
  else if (sapickerOptionLi) {
    let materIndex = sapickerOptionLi.getAttribute('data-master-index');
    let optionIndex = sapickerOptionLi.getAttribute('data-option-index');
    let activeItem = '<li>Select Option</li>';
    let newArray = sapickerMaterArr[materIndex].sapickerSubArr.map((item, index) => {
      if (optionIndex == index) {
        let imageTag = '';
        if (item.image) {
          imageTag = `<img src="${item.image}" alt="flag">`;
        }
        activeItem = `<li>${imageTag + item.text}</li>`;
        return Object.assign(item, { active: true });
      }
      else {
        return Object.assign(item, { active: false });
      }
    });
    sapickerMaterArr[materIndex].sapickerSubArr = newArray;
    let elmID = document.getElementById(`wrap-sapicker-${materIndex}`);
    elmID.querySelector(".sapicker-option").classList.remove("sapicker-option-show");
    elmID.querySelector(".sapicker-selected").innerHTML = activeItem;
    document.getElementById(`sapicker-${materIndex}`).querySelector(".sapicker").selectedIndex = optionIndex;
  }
  else {
    document.querySelectorAll(".sapicker-option").forEach((item) => {
      item.classList.remove("sapicker-option-show");
    });
  }
});

// ✅ NEW FUNCTION: Add options dynamically (AJAX-like)
function addSapickerOptions(pickerIndex, newOptions, selectedValue = null) {
  // Get the original <select>
  let selectEl = document.getElementById(`sapicker-${pickerIndex}`).querySelector(".sapicker");

  // Append new <option> elements
  newOptions.forEach(opt => {
    let optionEl = document.createElement("option");
    optionEl.value = opt.value;
    optionEl.text = opt.text;
    if (opt.image) {
      optionEl.setAttribute("data-thumbnail", opt.image);
    }
    selectEl.appendChild(optionEl);
  });

  // Rebuild the array for this picker
  let sapickerSubArr = [];
  selectEl.querySelectorAll("option").forEach((opt, i) => {
    let img = opt.getAttribute("data-thumbnail");
    let text = opt.innerText;
    let value = opt.value;
    let active = (selectedValue !== null && value === selectedValue);
    sapickerSubArr.push({ index: i, image: img, text: text, value: value, active: active });
  });

  sapickerMaterArr[pickerIndex].sapickerSubArr = sapickerSubArr;

  // Remove old UI
  let wrapDiv = document.getElementById(`wrap-sapicker-${pickerIndex}`);
  if (wrapDiv) wrapDiv.remove();

  // Re-render
  saPickerIteration();

  // If selectedValue provided, also set the <select>
  if (selectedValue !== null) {
    selectEl.value = selectedValue;
  }
}

// Export globally
window.addSapickerOptions = addSapickerOptions;
