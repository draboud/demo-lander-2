//.......................................................................
//.......................................................................
//GLOBAL DEFINITIONS
const BLACKOUT_SECTION = 50;
const BLACKOUT_STANDARD = 150;
const RESET_TO_FEATURES_MAIN = 100;
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
// let activeSection;
// let activeSectionName;
//.......................................................................
//.......................................................................
//FEATURES DEFINITIONS
const allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
const allVidsFeaturesMobileP =
  sectionFeatures.querySelectorAll(".vid.mobile-p");

const allSectionVidsFeatures = [...allVidsFeatures, ...allVidsFeaturesMobileP];
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
const DeactivateSectionImages = function (sectionName) {
  if (!sectionName) {
    activeSection.querySelectorAll(".section-img").forEach(function (el) {
      el.classList.remove("active");
    });
  } else {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelectorAll(".section-img")
      .forEach(function (el) {
        el.classList.remove("active");
      });
  }
};
const DeactivateSectionVideos = function (sectionName) {
  if (!sectionName) {
    activeSection.querySelectorAll(".video-wrap").forEach(function (el) {
      el.classList.remove("active");
    });
  } else {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelectorAll(".video-wrapper")
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
const ActivateSectionImage = function (imgName) {
  activeSection
    .querySelector(`.section-wrap-imgs.${imgName}`)
    .querySelectorAll(".section-img")
    .forEach(function (el) {
      el.classList.add("active");
    });
};
const ActivateSectionVideo = function (vidName, vidIndex) {
  DeactivateSectionVideos();
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
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap")
    [vidIndex].querySelector(".vid")
    .play();
  activeSection
    .querySelector(`.section-wrap-vids.${vidName}`)
    .querySelectorAll(".video-wrap.mobile-p")
    [vidIndex].querySelector(".vid.mobile-p")
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
    ResetToMainScreen();
  });
});
ctrlBtnWrapper.addEventListener("click", function (e) {
  const clicked = e.target.closest(".ctrl-btn.features");
  if (!clicked) return;
  const parentElement = clicked.parentElement;
  const clickedIndex = Array.prototype.indexOf.call(
    parentElement.children,
    clicked
  );
  FlashBlackout(BLACKOUT_STANDARD);
  DeactivateSectionImages();
  ResetSectionVideos();
  ActivateSectionVideo("features", clickedIndex);
  PlaySectionVideo("features", clickedIndex);
});
const ResetToMainScreen = function () {
  setTimeout(function () {
    DeactivateSectionVideos();
    ActivateSectionImage("main");
  }, RESET_TO_FEATURES_MAIN);
};
//.......................................................................
//.......................................................................
//COMPONENTS SECTION
ctrlBtnWrapper.addEventListener("click", function (e) {
  const clicked = e.target.closest(".ctrl-btn.components");
  if (!clicked) return;
  const parentElement = clicked.parentElement;
  const clickedIndex = Array.prototype.indexOf.call(
    parentElement.children,
    clicked
  );
  // console.log("sectionName: " + sectionName);
  // console.log("clickedIndex: " + clickedIndex);
  FlashBlackout(BLACKOUT_STANDARD);
  DeactivateSectionImages();
  ResetSectionVideos();
  ActivateSectionVideo("components", clickedIndex);
  PlaySectionVideo("datasheets", clickedIndex);
});
