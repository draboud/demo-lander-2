console.log("TEST-2");
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
let viewBtnName;
let explodeOrAssemble;
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
    ActivateDeactivateSectionText("main");
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
      ActivateDeactivateSectionImage("assemble");
      viewBtn.textContent = "explode";
      [datasheetsAllWrapper, ...allDatasheetWraps].forEach(function (el) {
        el.classList.remove("active");
      });
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
const ActivateDeactivateSectionText = function (textName) {
  activeSection.querySelectorAll(".section-wrap-text").forEach(function (el) {
    el.classList.remove("active");
    if (textName && el.classList.contains(textName)) el.classList.add("active");
  });
};
const ActivateDeactivateSectionImage = function (imgName, imgIndex) {
  activeSection.querySelectorAll(".section-wrap-imgs").forEach(function (el) {
    el.classList.remove("active");
    if (imgName && el.classList.contains(imgName)) {
      el.classList.add("active");
      if (imgIndex || imgIndex === 0) {
        el.querySelectorAll(".section-img").forEach(function (el2) {
          el2.classList.remove("active");
        });
        el.querySelectorAll(".section-img.mobile-p").forEach(function (el2) {
          el2.classList.remove("active");
        });
        el.querySelectorAll(".section-img")[imgIndex].classList.add("active");
        el.querySelectorAll(".section-img.mobile-p")[imgIndex].classList.add(
          "active"
        );
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
const ResetSectionVideos = function (sectionName) {
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
  } else {
    document
      .querySelector(`.section_${sectionName}`)
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
  FlashBlackout(BLACKOUT_STANDARD);
  ActivateDeactivateSectionText();
  ActivateDeactivateSectionImage();
  ResetSectionVideos();
  ActivateSectionVideo("features", ctrlBtnIndex);
  PlaySectionVideo("features", ctrlBtnIndex);
});
const ResetToFeaturesMainScreen = function () {
  setTimeout(function () {
    DeactivateSectionVideos();
    ActivateDeactivateSectionText("main");
    ActivateDeactivateSectionImage("main");
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
    const oldViewBtnName = viewBtnName;
    viewBtnName === "explode"
      ? (viewBtnName = "assemble")
      : (viewBtnName = "explode");
    viewBtn.textContent = viewBtnName;
    ActivateDeactivateSectionText("main");
    ActivateDeactivateSectionImage(oldViewBtnName, ctrlBtnIndex);
    ctrlBtnWrapperComponents.classList.add("active");
  });
});
viewBtn.addEventListener("click", function (e) {
  viewBtnName = viewBtn.textContent;
  FlashBlackout(BLACKOUT_STANDARD);
  ActivateDeactivateSectionText();
  ActivateDeactivateSectionImage();
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
  FlashBlackout(BLACKOUT_STANDARD);
  ActivateDeactivateSectionText();
  ActivateDeactivateSectionImage();
  ResetSectionVideos();
  ActivateSectionVideo("datasheets", ctrlBtnIndex);
  PlaySectionVideo("datasheets", ctrlBtnIndex);
  ctrlBtnWrapperComponents.classList.remove("active");
});

const DisplayDataSheet = function () {
  ActivateDeactivateSectionImage("comps", ctrlBtnIndex);
  ActivateDatasheetTextAndButton();
};
const ActivateDatasheetTextAndButton = function () {
  datasheetsAllWrapper.classList.add("active");
  allDatasheetWraps.forEach(function (el, index) {
    el.classList.remove("active");
    if (index === ctrlBtnIndex) el.classList.add("active");
  });
  datasheetBtn.classList.add("active");
};
