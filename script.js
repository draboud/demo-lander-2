// console.log("TEST-3");
//.......................................................................
//.......................................................................
//GLOBAL DEFINITIONS
const BLACKOUT_STANDARD = 50;
const BLACKOUT_INIT = 2500;
const DELAY_BEFORE_FEATURE_TEXT = 1000;
const PAUSE_AFTER_FEATURE_END = 650;
const NO_OF_INSTRUCTION_VIDS = 4;
const PAUSE_BETWEEN_INSTRUCTION_VIDS = 1500;
const INSTRUCTION_VIDS_LOOPING = true;
const navBar = document.querySelector(".nav_fixed");
const navLinkFeatures = document.querySelector(".nav_menu_link.features");
const navLinkComponents = document.querySelector(".nav_menu_link.components");
const navLinkInstructions = document.querySelector(
  ".nav_menu_link.instructions"
);
const allNavLinks = document.querySelectorAll(".nav_menu_link");
const loader = document.querySelector(".loader-text");
const blackout = document.querySelector(".blackout");
const sectionFeatures = document.querySelector(".section_features");
const sectionComponents = document.querySelector(".section_components");
const sectionInstructions = document.querySelector(".section_instructions");
const allSections = [sectionFeatures, sectionComponents, sectionInstructions];
const ctrlBtnWrapper = document.querySelector(".ctrl-btn-wrapper");
const allCtrlBtns = document.querySelectorAll(".ctrl-btn");
const allSectionBtnWrappers = document.querySelectorAll(".section-wrap-btns");
let initializing = true;
let activeSection = document.querySelector(".section_features");
let activeSectionName = activeSection.classList[0].slice(8);
let ctrlBtnIndex;
//.......................................................................
//.......................................................................
//FEATURES DEFINITIONS
const allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
const allCtrlBtnsFeatures =
  ctrlBtnWrapper.querySelectorAll(".ctrl-btn.features");
//.......................................................................
//.......................................................................
//COMPONENTS DEFINITIONS
const allVidsComponentViews = [
  sectionComponents
    .querySelector(".section-wrap-vids.view-a")
    .querySelector(".vid"),
  sectionComponents
    .querySelector(".section-wrap-vids.view-b")
    .querySelector(".vid"),
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
const optsMenuBtn = sectionComponents.querySelector(".opts-menu_btn");
const optsMenu = sectionComponents.querySelector(".opts-menu");
const dimmer = sectionComponents.querySelector(".dimmer");
const textImgBtn = sectionComponents.querySelector(".text-img-btn");
const allCtrlBtnsComponents = ctrlBtnWrapper.querySelectorAll(
  ".ctrl-btn.components"
);
const backBtn = ctrlBtnWrapper.querySelector(".ctrl-btn.back");
// let oldOptsMenuBtnName = "view-a";
// let optsMenuBtnName = "view-b";
// let formerViewName = "view-a";
let currentViewName = "view-a";
let textImgBtnLabel = "image";
let activeDatasheet;
//.......................................................................
//.......................................................................
//INSTRUCTIONS DEFINITIONS
const allVidsInstructions = sectionInstructions.querySelectorAll(".vid");
const allCtrlBtnsInstructions = sectionInstructions.querySelectorAll(
  ".ctrl-btn.instructions"
);
let currentInstructionVid;
let instructionVidTimer;
//.......................................................................
//.......................................................................
//INITIALIZE
const init = function () {
  blackout.classList.remove("off");
  loader.classList.add("active");
  navBar.style.display = "none";
  ctrlBtnWrapper.classList.remove("active");
};
init();
window.addEventListener("load", function () {
  navLinkInstructions.click();
  navLinkComponents.click();
  navLinkFeatures.click();
  this.setTimeout(function () {
    navBar.style.display = "block";
    ctrlBtnWrapper.classList.add("active");
    initializing = false;
    loader.classList.remove("active");
    blackout.classList.add("off");
  }, BLACKOUT_INIT);
});
//.......................................................................
//.......................................................................
//GLOBAL FUNCTIONS
allCtrlBtns.forEach(function (el) {
  el.addEventListener("mouseenter", function () {
    el.classList.add("hovered");
  });
});
allCtrlBtns.forEach(function (el) {
  el.addEventListener("mouseleave", function () {
    el.classList.remove("hovered");
  });
});
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
    if (activeSectionName === "features") PlaySectionVideo("main");
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
      DeactivateActivateSectionImage();
      ActivateSectionVideo("main");
      DeactivateActivateCurrentCtrlButtons("features");
      break;
    case "components":
      DeactivateActivateSectionImage(currentViewName);
      // optsMenuBtn.textContent = currentViewName;
      [datasheetsAllWrapper, ...allDatasheetWraps].forEach(function (el) {
        el.classList.remove("active");
      });
      if (currentViewName === "view-a") {
        startIndex = 0; //where the heck are these index variables defined?
        endIndex = 5;
      } else {
        startIndex = 6;
        endIndex = 11;
      }
      dimmer.classList.remove("active");
      textImgBtn.textContent = "image";
      textImgBtnLabel = "image";
      DeactivateActivateCtrlBtnRange("components", startIndex, endIndex);
      break;
    case "instructions":
      clearTimeout(instructionVidTimer);
      instructionVidTimer = null;
      DeactivateActivateSectionImage("main");
      DeactivateActivateCurrentCtrlButtons("instructions");
      break;
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
const ActivateSection = function () {
  allSections.forEach(function (el) {
    el.classList.remove("active");
    if (el.classList[0].slice(8) === activeSectionName) {
      el.classList.add("active");
      if (!initializing) FlashBlackout(BLACKOUT_STANDARD);
    }
  });
};
const ActivateSectionButtons = function () {
  allSectionBtnWrappers.forEach(function (el) {
    el.classList.remove("active");
  });
  ctrlBtnWrapper
    .querySelector(`.section-wrap-btns.${activeSectionName}`)
    .classList.add("active");
  backBtn.classList.remove("active");
};
const FlashBlackout = function (timerVariable) {
  blackout.classList.remove("off");
  setTimeout(function () {
    blackout.classList.add("off");
  }, timerVariable);
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
const DeactivateActivateCurrentCtrlButtons = function (sectionName, btnIndex) {
  document
    .querySelectorAll(`.ctrl-btn.${sectionName}`)
    .forEach(function (el, index) {
      el.classList.remove("current", "hovered");
      if ((btnIndex || btnIndex === 0) && index === btnIndex)
        el.classList.add("current");
    });
};
const DeactivateActivateCtrlBtnRange = function (
  btnsName,
  startIndex,
  endIndex
) {
  ctrlBtnWrapper
    .querySelector(`.section-wrap-btns.${btnsName}`)
    .querySelectorAll(".ctrl-btn")
    .forEach(function (el, index) {
      el.classList.remove("active");
      if (index >= startIndex && index <= endIndex) el.classList.add("active");
    });
};
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
  ActivateSectionVideo("features", ctrlBtnIndex);
  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();
  ResetSectionVideos();
  PlaySectionVideo("features", ctrlBtnIndex);
  DeactivateActivateCurrentCtrlButtons("features", ctrlBtnIndex);
  setTimeout(function () {
    DeactivateActivateSectionText("feature", ctrlBtnIndex);
  }, DELAY_BEFORE_FEATURE_TEXT);
});
const ResetToFeaturesMainScreen = function () {
  setTimeout(function () {
    FlashBlackout(50);
    ActivateSectionVideo("main");
    DeactivateActivateSectionText();
    setTimeout(function () {
      DeactivateActivateSectionText("main");
    }, DELAY_BEFORE_FEATURE_TEXT);
    PlaySectionVideo("main");
    DeactivateActivateCurrentCtrlButtons("features", false);
  }, PAUSE_AFTER_FEATURE_END);
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
    let startRange;
    let endRange;
    if (currentViewName === "view-a") {
      startRange = 0;
      endRange = 5;
    } else {
      startRange = 6;
      endRange = 11;
    }
    DeactivateActivateSectionImage(currentViewName, ctrlBtnIndex);
    DeactivateActivateSectionText("main");
    ctrlBtnWrapperComponents
      .querySelectorAll(".ctrl-btn")
      .forEach(function (el) {
        el.classList.remove("active");
      });
    DeactivateActivateCtrlBtnRange("components", startRange, endRange);
    ctrlBtnWrapperComponents.classList.add("active");
  });
});
optsMenuBtn.addEventListener("click", function () {
  optsMenu.classList.add("active");
});
optsMenu.addEventListener("click", function (e) {
  const clicked = e.target.closest(".opts-menu_link");
  if (!clicked) return;
  optsMenu.classList.remove("active");
  if (currentViewName !== clicked.textContent) {
    currentViewName = clicked.textContent;
    optsMenuBtn.textContent = currentViewName;
    ctrlBtnIndex = "";
    DeactivateActivateSectionText();
    DeactivateActivateSectionImage();
    ResetSectionVideos();
    ActivateSectionVideo(currentViewName);
    PlaySectionVideo(currentViewName);
    ctrlBtnWrapperComponents.classList.remove("active");
  }
});
textImgBtn.addEventListener("click", function () {
  textImgBtnLabel === "image"
    ? (textImgBtn.textContent = "text")
    : (textImgBtn.textContent = "image");
  textImgBtnLabel = textImgBtn.textContent;
  activeDatasheet
    .querySelector(".comp-data-body-wrap")
    .classList.toggle("active");
  dimmer.classList.toggle("active");
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
  const clicked = e.target.closest(".ctrl-btn.back");
  if (!clicked) return;
  ResetSectionVideos("components", "datasheets");
  DeactivateActivateSectionImage(currentViewName);
  dimmer.classList.remove("active");
  ActivateDeactivateDatasheetTextAndButtons(false);
  DeactivateActivateSectionText("main");
  ActivateSection();
  ActivateSectionButtons();
});
const DisplayDataSheet = function () {
  DeactivateActivateSectionImage("comps", ctrlBtnIndex);
  dimmer.classList.add("active");
  ActivateDeactivateDatasheetTextAndButtons(true);
};
const ActivateDeactivateDatasheetTextAndButtons = function (activeDeactivate) {
  textImgBtn.classList.toggle("active", activeDeactivate);
  datasheetsAllWrapper.classList.toggle("active", activeDeactivate);
  allDatasheetWraps.forEach(function (el, index) {
    el.classList.remove("active");
    el.querySelector(".comp-data-body-wrap").classList.add("active");
    if (activeDeactivate && index === ctrlBtnIndex) {
      el.classList.add("active");
      activeDatasheet = el;
    }
  });
  backBtn.classList.toggle("active", activeDeactivate);
};
//.......................................................................
//.......................................................................
//INSTRUCTIONS SECTION
allVidsInstructions.forEach(function (el) {
  el.addEventListener("ended", function () {
    instructionVidTimer = setTimeout(function () {
      currentInstructionVid += 1;
      if (
        currentInstructionVid === NO_OF_INSTRUCTION_VIDS &&
        INSTRUCTION_VIDS_LOOPING
      ) {
        currentInstructionVid = 0;
      } else if (
        currentInstructionVid === NO_OF_INSTRUCTION_VIDS &&
        !INSTRUCTION_VIDS_LOOPING
      ) {
        ResetToInstructionsMainScreen();
        return;
      }
      ResetSectionVideos();
      ActivateSectionVideo("instructions", currentInstructionVid);
      PlaySectionVideo("instructions", currentInstructionVid);
      DeactivateActivateCurrentCtrlButtons(
        "instructions",
        currentInstructionVid
      );
    }, PAUSE_BETWEEN_INSTRUCTION_VIDS);
  });
});
ctrlBtnWrapper.addEventListener("click", function (e) {
  const clicked = e.target.closest(".ctrl-btn.instructions");
  if (!clicked) return;
  const parentElement = clicked.parentElement;
  currentInstructionVid = Array.prototype.indexOf.call(
    parentElement.children,
    clicked
  );
  // currentInstructionVid =
  //   Array.from(allCtrlBtnsInstructions).indexOf(clicked) + 1; //why is this always '0'?
  FlashBlackout(BLACKOUT_STANDARD);
  clearTimeout(instructionVidTimer);
  instructionVidTimer = null;
  ResetSectionVideos();
  ActivateSectionVideo("instructions", currentInstructionVid);
  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();
  PlaySectionVideo("instructions", currentInstructionVid);
  DeactivateActivateCurrentCtrlButtons("instructions", currentInstructionVid);
});
const ResetToInstructionsMainScreen = function () {
  FlashBlackout(BLACKOUT_STANDARD);
  DeactivateSectionVideos();
  DeactivateActivateSectionText("main");
  DeactivateActivateSectionImage("main");
  DeactivateActivateCurrentCtrlButtons("instructions", false);
};
