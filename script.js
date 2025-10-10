// console.log("TEST-1");
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
// const allButtons = document.querySelectorAll(".ctrl-btn");
let activeSection = document.querySelector(".section_features");
let activeSectionName = activeSection.classList[0].slice(8);
let ctrlBtnIndex;
// let activeSection;
// let activeSectionName;
//.......................................................................
//.......................................................................
//FEATURES DEFINITIONS
const allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
// const allVidsFeaturesMobileP =
//   sectionFeatures.querySelectorAll(".vid.mobile-p");
// const allSectionVidsFeatures = [...allVidsFeatures, ...allVidsFeaturesMobileP];
//.......................................................................
//.......................................................................
//COMPONENTS DEFINITIONS
const allVidsComponents = sectionComponents.querySelectorAll(".vid");
// const allVidsComponentsMobileP =
//   sectionComponents.querySelectorAll(".vid.mobile-p");
// const allSectionVidsComponents = [
//   ...allVidsComponents,
//   ...allVidsComponentsMobileP,
// ];
//.......................................................................
//.......................................................................
//GLOBAL FUNCTIONS
allNavLinks.forEach(function (el) {
  el.addEventListener("click", function (e) {
    const clicked = e.target.closest(".nav_menu_link");
    if (!clicked) return;
    activeSectionName = clicked.classList[1];
    ResetSectionVideos("all");
    ActivateNavLink();
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
const ActivateSection = function () {
  allSections.forEach(function (el) {
    el.classList.remove("active");
    if (el.classList[0].slice(8) === activeSectionName) {
      el.classList.add("active");
      activeSection = el;
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
      if (imgIndex) {
        el.querySelectorAll(".section-img")[imgIndex].classList.add("active");
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
const ActivateSectionVideo = function (vidName) {
  DeactivateSectionVideos();
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap")
    [ctrlBtnIndex].classList.add("active");
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap.mobile-p")
    [ctrlBtnIndex].classList.add("active");
};
const PlaySectionVideo = function (vidName) {
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap")
    [ctrlBtnIndex].querySelector(".vid")
    .play();
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap.mobile-p")
    [ctrlBtnIndex].querySelector(".vid-mobile-p")
    .play();
};
const ActivateSectionButtons = function () {
  allSectionBtnWrappers.forEach(function (el) {
    el.classList.remove("active");
  });
  ctrlBtnWrapper
    .querySelector(`.section-wrap-btns.${activeSectionName}`)
    .classList.add("active");
};
//.......................................................................
//.......................................................................
//CONSTRUCTION ZONE
// ActivateSectionButtons("components");

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
  ActivateSectionVideo("features");
  PlaySectionVideo("features");
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
allVidsComponents.forEach(function (el) {
  el.addEventListener("ended", function () {
    DisplayDataSheet();
  });
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
  ActivateSectionVideo("datasheets");
  PlaySectionVideo("datasheets");
});

const DisplayDataSheet = function () {
  ActivateDeactivateSectionImage("comps", ctrlBtnIndex);
};
