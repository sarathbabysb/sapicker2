(function (window) {

  const sapickerMaterArr = [];

  // ✅ Build single picker UI
  const renderPicker = (index) => {
    // Remove old UI for this picker
    const oldWrap = document.getElementById(`wrap-sapicker-${index}`);
    if (oldWrap) oldWrap.remove();

    const maItem = sapickerMaterArr[index];
    if (!maItem) return;

    let saSubHtml = '';
    let activeItem = '<li>Select Option</li>';
    maItem.sapickerSubArr?.forEach((item, i) => {
      let imageTag = item.image ? `<img src="${item.image}" alt="flag">` : '';
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
    saChildDiv.setAttribute('id', `wrap-sapicker-${index}`);
    saChildDiv.innerHTML = saMasterHtml;
    document.getElementById(`sapicker-${index}`).appendChild(saChildDiv);
  };

  // ✅ Initial render for all
  const createDivs = (el) => {
    sapickerMaterArr.length = 0; // clear previous
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
      sapickerMaterArr[index] = { index: index, sapickerSubArr: sapickerSubArr };
      renderPicker(index);
    });
  };

  // ✅ Click handler
  document.addEventListener("click", function (event) {
    let sapickerSelectedLi = event.target.closest(".sapicker-selected li");
    let sapickerOptionLi = event.target.closest(".sapicker-option li");
    if (sapickerSelectedLi) {
      let elmID = sapickerSelectedLi.parentNode.parentNode.getAttribute('id');
      let clickedElement = document.getElementById(elmID).querySelector(".sapicker-option");
      document.querySelectorAll(".sapicker-option").forEach((item) => {
        if (item != clickedElement) item.classList.remove("sapicker-option-show");
      });
      clickedElement.classList.toggle("sapicker-option-show");
    }
    else if (sapickerOptionLi) {
      let materIndex = sapickerOptionLi.getAttribute('data-master-index');
      let optionIndex = sapickerOptionLi.getAttribute('data-option-index');
      let activeItem = '<li>Select Option</li>';
      let newArray = sapickerMaterArr[materIndex].sapickerSubArr.map((item, index) => {
        if (optionIndex == index) {
          let imageTag = item.image ? `<img src="${item.image}" alt="flag">` : '';
          activeItem = `<li>${imageTag + item.text}</li>`;
          return Object.assign(item, { active: true });
        } else {
          return Object.assign(item, { active: false });
        }
      });
      sapickerMaterArr[materIndex].sapickerSubArr = newArray;
      document.getElementById(`wrap-sapicker-${materIndex}`)
        .querySelector(".sapicker-option").classList.remove("sapicker-option-show");
      document.getElementById(`wrap-sapicker-${materIndex}`)
        .querySelector(".sapicker-selected").innerHTML = activeItem;
      document.getElementById(`sapicker-${materIndex}`).querySelector(".sapicker").selectedIndex = optionIndex;
    }
    else {
      document.querySelectorAll(".sapicker-option").forEach((item) => {
        item.classList.remove("sapicker-option-show");
      });
    }
  });

  // ✅ Utility: get index from select id
  function getPickerIndexFromId(selectId) {
    const selectEl = document.getElementById(selectId);
    const parentId = selectEl.parentNode.getAttribute('id'); // "sapicker-X"
    return parentId.split('-')[1];
  }

  // ✅ Add options dynamically
  function addOptions(selectId, newOptions, selectedValue = null) {
    let pickerIndex = getPickerIndexFromId(selectId);
    let selectEl = document.getElementById(selectId);

    // Append new options
    newOptions.forEach(opt => {
      let optionEl = document.createElement("option");
      optionEl.value = opt.value;
      optionEl.text = opt.text;
      if (opt.image) optionEl.setAttribute("data-thumbnail", opt.image);
      selectEl.appendChild(optionEl);
    });

    // Rebuild array
    let sapickerSubArr = [];
    selectEl.querySelectorAll("option").forEach((opt, i) => {
      let img = opt.getAttribute("data-thumbnail");
      let text = opt.innerText;
      let value = opt.value;
      let active = (selectedValue !== null && value === selectedValue);
      sapickerSubArr.push({ index: i, image: img, text: text, value: value, active: active });
    });

    sapickerMaterArr[pickerIndex] = { index: pickerIndex, sapickerSubArr: sapickerSubArr };

    if (selectedValue !== null) selectEl.value = selectedValue;

    // Render only this picker
    renderPicker(pickerIndex);
  }

  // ✅ Reset picker
  function reset(selectId) {
    let pickerIndex = getPickerIndexFromId(selectId);
    let selectEl = document.getElementById(selectId);

    selectEl.innerHTML = `<option value="" selected>Select Option</option>`;
    sapickerMaterArr[pickerIndex] = {
      index: pickerIndex,
      sapickerSubArr: [
        { index: 0, image: null, text: 'Select Option', value: '', active: true }
      ]
    };

    selectEl.value = '';
    renderPicker(pickerIndex);
  }

  // ✅ Global
  window.Sapicker = {
    init: function () {
      createDivs(document.querySelectorAll('.sapicker'));
    },
    addOptions,
    reset
  };

})(window);

// Auto init
window.addEventListener('DOMContentLoaded', () => {
  Sapicker.init();
});
