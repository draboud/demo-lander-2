// console.log("TEST-3");
//.......................................................................
//.......................................................................
//GLOBAL DEFINITIONS
const BLACKOUT_SECTION = 50;
const BLACKOUT_STANDARD = 150;
const BLACKOUT_RESET_FEATURES = 500;
const PAUSE_FEATURE_END = 1000;
const allNavLinks = document.querySelectorAll(".nav_menu_link");
const blackout = document.querySelector(".blackout");
const sectionFeatures = document.querySelector(".section_features");
const sectionComponents = document.querySelector(".section_components");
const sectionInstructions = document.querySelector(".section_instructions");
const allSections = [sectionFeatures, sectionComponents, sectionInstructions];
const ctrlBtnWrapper = document.querySelector(".ctrl-btn-wrapper");
const allSectionBtnWrappers = document.querySelectorAll(".section-wrap-btns");
let activeSection = document.querySelector(".section_features");
let activeSectionName = activeSection.classList[0].slice(8);
let ctrlBtnIndex;

//.......................................................................
//.......................................................................
//FEATURES DEFINITIONS
const allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
//.......................................................................
//.......................................................................
//COMPONENTS DEFINITIONS
const allVidsComponentViews = [
  document.querySelector(".section-wrap-vids.explode").querySelector(".vid"),
  document.querySelector(".section-wrap-vids.assemble").querySelector(".vid"),
];
const allVidsComponentDatasheets = sectionComponents
  .querySelector(".section-wrap-vids.datasheets")
  .querySelectorAll(".vid");
const datasheetsAllWrapper = sectionComponents.querySelector(
  ".section-wrap-comp-data"
);
const allDatasheetWraps = sectionComponents.querySelectorAll(".comp-data-wrap");
const ctrlBtnWrapperComponents = ctrlBtnWrapper.querySelector(
  ".section-wrap-btns.components"
);
const viewBtn = document.querySelector(".view-btn");
const allCtrlBtnsComponents = ctrlBtnWrapper.querySelectorAll(
  ".ctrl-btn.components"
);
const datasheetBtn = ctrlBtnWrapper.querySelector(".ctrl-btn.datasheets");
let oldViewBtnName = "assemble";
let viewBtnName = "explode";
//.......................................................................
//.......................................................................
//GLOBAL FUNCTIONS
allNavLinks.forEach(function (el) {
  el.addEventListener("click", function (e) {
    const clicked = e.target.closest(".nav_menu_link");
    if (!clicked) return;
    activeSectionName = clicked.classList[1];
    activeSection = document.querySelector(`.section_${activeSectionName}`);
    ActivateNavLink();
    ResetSectionSpecial();
    ResetSectionVideos("all");
    DeactivateActivateSectionText("main");
    ActivateSection();
    ActivateSectionButtons();
  });
});
const ActivateNavLink = function () {
  allNavLinks.forEach(function (el) {
    el.classList.remove("current");
    if (el.classList.contains(activeSectionName)) el.classList.add("current");
  });
};
const ResetSectionSpecial = function () {
  switch (activeSectionName) {
    case "features":
      break;
    case "components":
      DeactivateActivateSectionImage(oldViewBtnName);
      viewBtn.textContent = viewBtnName;
      [datasheetsAllWrapper, ...allDatasheetWraps].forEach(function (el) {
        el.classList.remove("active");
      });
      if (oldViewBtnName === "assemble") {
        startIndex = 6;
        endIndex = 11;
      } else {
        startIndex = 0;
        endIndex = 5;
      }
      ActivateDeactivateCtrlBtnRange(true, "components", startIndex, endIndex);
      ActivateDeactivateCtrlBtnRange(false, "components", startIndex, endIndex);
      break;
    case "instructions":
      break;
  }
};
const ActivateSection = function () {
  allSections.forEach(function (el) {
    el.classList.remove("active");
    if (el.classList[0].slice(8) === activeSectionName) {
      el.classList.add("active");
      FlashBlackout(BLACKOUT_SECTION);
    }
  });
};
const FlashBlackout = function (timerVariable) {
  blackout.classList.remove("off");
  setTimeout(function () {
    blackout.classList.add("off");
  }, timerVariable);
};
const DeactivateActivateSectionText = function (textName, textIndex) {
  activeSection.querySelectorAll(".section-wrap-text").forEach(function (el) {
    el.classList.remove("active");
    if (textName && el.classList.contains(textName)) {
      el.classList.add("active");
      if (textIndex || textIndex === 0) {
        el.querySelectorAll(".text-wrapper").forEach(function (el2, index) {
          el2.classList.remove("active");
          if (index === textIndex) el2.classList.add("active");
        });
      }
    }
  });
};
const DeactivateActivateSectionImage = function (imgName, imgIndex) {
  activeSection.querySelectorAll(".section-wrap-imgs").forEach(function (el) {
    el.classList.remove("active");
    if (imgName && el.classList.contains(imgName)) {
      el.classList.add("active");
      if (imgIndex || imgIndex === 0) {
        el.querySelectorAll(".section-img").forEach(function (el2, index) {
          el2.classList.remove("active");
          if (index === imgIndex) el2.classList.add("active");
        });
        el.querySelectorAll(".section-img.mobile-p").forEach(function (
          el2,
          index
        ) {
          el2.classList.remove("active");
          if (index === imgIndex) el2.classList.add("active");
        });
      }
    }
  });
};
const DeactivateSectionVideos = function (sectionName) {
  if (!sectionName) {
    activeSection.querySelectorAll(".video-wrap").forEach(function (el) {
      el.classList.remove("active");
    });
  } else {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelectorAll(".video-wrap")
      .forEach(function (el) {
        el.classList.remove("active");
      });
  }
};
const ResetSectionVideos = function (sectionName, subsectionName) {
  if (sectionName === "all") {
    document.querySelectorAll(`.vid,.vid-mobile-p`).forEach(function (el) {
      el.currentTime = 0;
      el.pause();
    });
  } else if (!sectionName) {
    activeSection.querySelectorAll(`.vid,.vid-mobile-p`).forEach(function (el) {
      el.currentTime = 0;
      el.pause();
    });
  } else if (sectionName && !subsectionName) {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelectorAll(`.vid,.vid-mobile-p`)
      .forEach(function (el) {
        el.currentTime = 0;
        el.pause();
      });
  } else {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelector(`.section-wrap-vids.${subsectionName}`)
      .querySelectorAll(`.vid,.vid-mobile-p`)
      .forEach(function (el) {
        el.currentTime = 0;
        el.pause();
      });
  }
};
const ActivateSectionVideo = function (vidName, vidIndex) {
  DeactivateSectionVideos();
  if (!vidIndex) vidIndex = 0;
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap")
    [vidIndex].classList.add("active");
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap.mobile-p")
    [vidIndex].classList.add("active");
};
const PlaySectionVideo = function (vidName, vidIndex) {
  if (!vidIndex) vidIndex = 0;
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap")
    [vidIndex].querySelector(".vid")
    .play();
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap.mobile-p")
    [vidIndex].querySelector(".vid-mobile-p")
    .play();
};
const ActivateSectionButtons = function () {
  allSectionBtnWrappers.forEach(function (el) {
    el.classList.remove("active");
  });
  ctrlBtnWrapper
    .querySelector(`.section-wrap-btns.${activeSectionName}`)
    .classList.add("active");
  datasheetBtn.classList.remove("active");
};
const ActivateDeactivateCtrlBtnRange = function (
  activeDeactivate,
  btnsName,
  startIndex,
  endIndex
) {
  ctrlBtnWrapper
    .querySelector(`.section-wrap-btns.${btnsName}`)
    .querySelectorAll(".ctrl-btn")
    .forEach(function (el, index) {
      if (index >= startIndex && index <= endIndex)
        el.classList.toggle("active", activeDeactivate);
    });
};
//.......................................................................
//.......................................................................
//CONSTRUCTION ZONE

//.......................................................................
//.......................................................................
//FEATURES SECTION
allVidsFeatures.forEach(function (el) {
  el.addEventListener("ended", function () {
    ResetToFeaturesMainScreen();
  });
});
ctrlBtnWrapper.addEventListener("click", function (e) {
  const clicked = e.target.closest(".ctrl-btn.features");
  if (!clicked) return;
  const parentElement = clicked.parentElement;
  ctrlBtnIndex = Array.prototype.indexOf.call(parentElement.children, clicked);
  ActivateSectionVideo("features", ctrlBtnIndex);
  DeactivateActivateSectionText("feature", ctrlBtnIndex);
  DeactivateActivateSectionImage();
  ResetSectionVideos();
  PlaySectionVideo("features", ctrlBtnIndex);
});
const ResetToFeaturesMainScreen = function () {
  setTimeout(function () {
    DeactivateSectionVideos();
    DeactivateActivateSectionText("main");
    DeactivateActivateSectionImage("main");
  }, PAUSE_FEATURE_END);
};
//.......................................................................
//.......................................................................
//COMPONENTS SECTION
allVidsComponentDatasheets.forEach(function (el) {
  el.addEventListener("ended", function () {
    DisplayDataSheet();
  });
});
allVidsComponentViews.forEach(function (el) {
  el.addEventListener("ended", function () {
    oldViewBtnName = viewBtnName;
    viewBtnName === "explode"
      ? (viewBtnName = "assemble")
      : (viewBtnName = "explode");
    viewBtn.textContent = viewBtnName;
    let startRange;
    let endRange;
    if (oldViewBtnName === "explode") {
      startRange = 6;
      endRange = 11;
    } else {
      startRange = 0;
      endRange = 5;
    }
    DeactivateActivateSectionImage(oldViewBtnName, ctrlBtnIndex);
    DeactivateActivateSectionText("main");
    ctrlBtnWrapperComponents
      .querySelectorAll(".ctrl-btn")
      .forEach(function (el) {
        el.classList.remove("active");
      });
    ActivateDeactivateCtrlBtnRange(true, "components", startRange, endRange);
    ctrlBtnWrapperComponents.classList.add("active");
  });
});
viewBtn.addEventListener("click", function (e) {
  viewBtnName = viewBtn.textContent;
  ctrlBtnIndex = "";
  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();
  ResetSectionVideos();
  ActivateSectionVideo(viewBtnName);
  PlaySectionVideo(viewBtnName);
  ctrlBtnWrapperComponents.classList.remove("active");
});
ctrlBtnWrapper.addEventListener("click", function (e) {
  const clicked = e.target.closest(".ctrl-btn.components");
  if (!clicked) return;
  const parentElement = clicked.parentElement;
  ctrlBtnIndex = Array.prototype.indexOf.call(parentElement.children, clicked);
  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();
  ResetSectionVideos();
  ActivateSectionVideo("datasheets", ctrlBtnIndex);
  PlaySectionVideo("datasheets", ctrlBtnIndex);
  ctrlBtnWrapperComponents.classList.remove("active");
});
ctrlBtnWrapper.addEventListener("click", function (e) {
  const clicked = e.target.closest(".ctrl-btn.datasheets");
  if (!clicked) return;
  ResetSectionVideos("components", "datasheets");
  DeactivateActivateSectionImage(oldViewBtnName);
  ActivateDeactivateDatasheetTextAndButton(false);
  DeactivateActivateSectionText("main");
  ActivateSection();
  ActivateSectionButtons();
});

const DisplayDataSheet = function () {
  DeactivateActivateSectionImage("comps", ctrlBtnIndex);
  ActivateDeactivateDatasheetTextAndButton(true);
};
const ActivateDeactivateDatasheetTextAndButton = function (activeDeactivate) {
  datasheetsAllWrapper.classList.toggle("active", activeDeactivate);
  allDatasheetWraps.forEach(function (el, index) {
    el.classList.remove("active");
    if (activeDeactivate && index === ctrlBtnIndex) el.classList.add("active");
  });
  datasheetBtn.classList.toggle("active", activeDeactivate);
};
