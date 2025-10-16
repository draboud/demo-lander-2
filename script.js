// ......................................................................
// GLOBAL DEFINITIONS
const BLACKOUT_STANDARD = 50;
const BLACKOUT_EXTRA = 150;
const BLACKOUT_INIT = 2500;
const DELAY_BEFORE_FEATURE_TEXT = 1000;
const PAUSE_AFTER_FEATURE_END = 1500;
const NO_OF_INSTRUCTION_VIDS = 4;
const PAUSE_BETWEEN_INSTRUCTION_VIDS = 1500;
const INSTRUCTION_VIDS_LOOPING = true;
const COMP_BTNS_START_RANGE_A = 0;
const COMP_BTNS_END_RANGE_A = 5;
const COMP_BTNS_START_RANGE_B = 6;
const COMP_BTNS_END_RANGE_B = 11;

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
let ctrlBtnIndex = null;

// FEATURES
const allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
const allCtrlBtnsFeatures =
  ctrlBtnWrapper.querySelectorAll(".ctrl-btn.features");

// COMPONENTS
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
let currentViewName = "view-a";
let textImgBtnLabel = "image";
let activeDatasheet = null;

// INSTRUCTIONS
const allVidsInstructions = sectionInstructions.querySelectorAll(".vid");
const allCtrlBtnsInstructions = sectionInstructions.querySelectorAll(
  ".ctrl-btn.instructions"
);
let currentInstructionVid = 0;
let instructionVidTimer = null;

// ========== Utility functions ==========

function safePlay(videoEl) {
  if (!videoEl) return Promise.resolve();
  try {
    videoEl.muted = true;
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("webkit-playsinline", "");
  } catch (err) {
    console.warn("safePlay: setting video attributes failed:", err);
  }
  return videoEl.play().catch((err) => {
    console.warn("safePlay: play() failed:", err);
    try {
      videoEl.load();
      return videoEl.play().catch((err2) => {
        console.warn("safePlay: load+play failed:", err2);
      });
    } catch (err3) {
      console.warn("safePlay: load failed:", err3);
    }
  });
}

function autoplayMainFeatureVideo() {
  const wrap = sectionFeatures.querySelector(".section-wrap-vids.main");
  if (!wrap) return;
  const videoWrap = wrap.querySelector(".video-wrap");
  if (videoWrap) {
    const vidEl = videoWrap.querySelector(".vid");
    if (vidEl) safePlay(vidEl);
  }
  const mobileWrap = wrap.querySelector(".video-wrap.mobile-p");
  if (mobileWrap) {
    const vidEl2 = mobileWrap.querySelector(".vid-mobile-p");
    if (vidEl2) safePlay(vidEl2);
  }
}

function FlashBlackout(timerVariable) {
  blackout.classList.remove("off");
  setTimeout(() => {
    blackout.classList.add("off");
  }, timerVariable);
}

// ========== Initialization ==========

function init() {
  blackout.classList.remove("off");
  loader.classList.add("active");
  navBar.style.display = "none";
  ctrlBtnWrapper.classList.remove("active");
}
init();

window.addEventListener("load", function () {
  navLinkInstructions.click();
  navLinkComponents.click();
  navLinkFeatures.click();

  setTimeout(() => {
    navBar.style.display = "block";
    ctrlBtnWrapper.classList.add("active");
    initializing = false;
    loader.classList.remove("active");
    blackout.classList.add("off");
  }, BLACKOUT_INIT);

  setTimeout(() => {
    navLinkFeatures.click();
    autoplayMainFeatureVideo();
  }, BLACKOUT_INIT + 50);
});

// ========== Global event bindings ==========

allCtrlBtns.forEach((el) => {
  el.addEventListener("mouseenter", () => el.classList.add("hovered"));
  el.addEventListener("mouseleave", () => el.classList.remove("hovered"));
});

allNavLinks.forEach((el) => {
  ["click", "touchstart"].forEach((evtName) => {
    el.addEventListener(evtName, function (e) {
      e.preventDefault();
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
      if (activeSectionName === "features") {
        PlaySectionVideo("main");
      }
    });
  });
});

function ActivateNavLink() {
  allNavLinks.forEach((el) => {
    el.classList.remove("current");
    if (el.classList.contains(activeSectionName)) {
      el.classList.add("current");
    }
  });
}

function ResetSectionSpecial() {
  switch (activeSectionName) {
    case "features":
      ActivateSectionVideo("main");
      DeactivateActivateCurrentCtrlButtons("features");
      break;
    case "components":
      optsMenu.classList.remove("active");
      DeactivateActivateSectionImage(currentViewName);
      [datasheetsAllWrapper, ...allDatasheetWraps].forEach((el) => {
        el.classList.remove("active");
      });
      let startIndex, endIndex;
      if (currentViewName === "view-a") {
        startIndex = COMP_BTNS_START_RANGE_A;
        endIndex = COMP_BTNS_END_RANGE_A;
      } else {
        startIndex = COMP_BTNS_START_RANGE_B;
        endIndex = COMP_BTNS_END_RANGE_B;
      }
      dimmer.classList.remove("active");
      textImgBtn.textContent = "image";
      textImgBtnLabel = "image";
      DeactivateActivateCtrlBtnRange("components", startIndex, endIndex);
      break;
    case "instructions":
      if (instructionVidTimer) {
        clearTimeout(instructionVidTimer);
        instructionVidTimer = null;
      }
      DeactivateActivateSectionImage("main");
      DeactivateActivateCurrentCtrlButtons("instructions");
      break;
  }
}

function ResetSectionVideos(sectionName, subsectionName, vidIndex) {
  const resetOne = (el) => {
    try {
      el.currentTime = 0;
      el.pause();
    } catch (e) {
      // ignore
    }
  };

  if (sectionName === "all") {
    document.querySelectorAll(".vid, .vid-mobile-p").forEach(resetOne);
  } else if (!sectionName) {
    activeSection.querySelectorAll(".vid, .vid-mobile-p").forEach(resetOne);
  } else if (sectionName && !subsectionName) {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelectorAll(".vid, .vid-mobile-p")
      .forEach(resetOne);
  } else if (sectionName && subsectionName) {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelector(`.section-wrap-vids.${subsectionName}`)
      .querySelectorAll(".vid, .vid-mobile-p")
      .forEach(resetOne);
  }
}

function DeactivateActivateSectionText(textName, textIndex) {
  activeSection.querySelectorAll(".section-wrap-text").forEach((el) => {
    el.classList.remove("active");
    if (textName && el.classList.contains(textName)) {
      el.classList.add("active");
      if (textIndex || textIndex === 0) {
        el.querySelectorAll(".text-wrapper").forEach((el2, idx) => {
          el2.classList.remove("active");
          if (idx === textIndex) el2.classList.add("active");
        });
      }
    }
  });
}

function ActivateSection() {
  allSections.forEach((el) => el.classList.remove("active"));
  allSections.forEach((el) => {
    if (el.classList[0].slice(8) === activeSectionName) {
      el.classList.add("active");
      if (!initializing) {
        FlashBlackout(BLACKOUT_STANDARD);
      }
    }
  });
}

function ActivateSectionButtons() {
  allSectionBtnWrappers.forEach((el) => el.classList.remove("active"));
  const wrap = ctrlBtnWrapper.querySelector(
    `.section-wrap-btns.${activeSectionName}`
  );
  if (wrap) wrap.classList.add("active");
  backBtn.classList.remove("active");
}

function DeactivateActivateSectionImage(imgName, imgIndex) {
  activeSection.querySelectorAll(".section-wrap-imgs").forEach((el) => {
    el.classList.remove("active");
  });
  if (imgName) {
    const wrap = activeSection.querySelector(`.section-wrap-imgs.${imgName}`);
    if (wrap) {
      wrap.classList.add("active");
      if (imgIndex || imgIndex === 0) {
        wrap.querySelectorAll(".section-img").forEach((el2, idx) => {
          el2.classList.remove("active");
          if (idx === imgIndex) el2.classList.add("active");
        });
        wrap.querySelectorAll(".section-img.mobile-p").forEach((el2, idx) => {
          el2.classList.remove("active");
          if (idx === imgIndex) el2.classList.add("active");
        });
      }
    }
  }
}

function DeactivateSectionVideos(sectionName) {
  if (!sectionName) {
    activeSection
      .querySelectorAll(".video-wrap")
      .forEach((el) => el.classList.remove("active"));
  } else {
    document
      .querySelector(`.section_${sectionName}`)
      .querySelectorAll(".video-wrap")
      .forEach((el) => el.classList.remove("active"));
  }
}

function ActivateSectionVideo(vidName, vidIndex) {
  DeactivateSectionVideos();
  if (vidIndex == null) vidIndex = 0;
  const wrap = activeSection.querySelector(`.section-wrap-vids.${vidName}`);
  if (!wrap) return;
  const vels = wrap.querySelectorAll(".video-wrap");
  const velsMobile = wrap.querySelectorAll(".video-wrap.mobile-p");
  if (vels[vidIndex]) vels[vidIndex].classList.add("active");
  if (velsMobile[vidIndex]) velsMobile[vidIndex].classList.add("active");
}

function PlaySectionVideo(vidName, vidIndex) {
  if (vidName == null) vidName = "main";
  if (vidIndex == null) vidIndex = 0;
  const wrap = activeSection.querySelector(`.section-wrap-vids.${vidName}`);
  if (!wrap) return;
  const vwrap = wrap.querySelectorAll(".video-wrap")[vidIndex];
  const vmobile = wrap.querySelectorAll(".video-wrap.mobile-p")[vidIndex];
  if (vwrap) {
    const vidEl = vwrap.querySelector(".vid");
    safePlay(vidEl);
  }
  if (vmobile) {
    const vidEl2 = vmobile.querySelector(".vid-mobile-p");
    safePlay(vidEl2);
  }
}

function DeactivateActivateCurrentCtrlButtons(sectionName, btnIndex) {
  document.querySelectorAll(`.ctrl-btn.${sectionName}`).forEach((el, idx) => {
    el.classList.remove("current", "hovered");
    if ((btnIndex || btnIndex === 0) && idx === btnIndex) {
      el.classList.add("current");
    }
  });
}

function DeactivateActivateCtrlBtnRange(btnsName, startIndex, endIndex) {
  const wrap = ctrlBtnWrapper.querySelector(`.section-wrap-btns.${btnsName}`);
  if (!wrap) return;
  wrap.querySelectorAll(".ctrl-btn").forEach((el, idx) => {
    el.classList.remove("active");
    if (idx >= startIndex && idx <= endIndex) el.classList.add("active");
  });
}

// ========== FEATURES Section ==========

allVidsFeatures.forEach((el) => {
  el.addEventListener("ended", () => {
    ResetToFeaturesMainScreen();
  });
});

ctrlBtnWrapper.addEventListener("click", handleFeaturesCtrl);
ctrlBtnWrapper.addEventListener("touchstart", handleFeaturesCtrl);

function handleFeaturesCtrl(e) {
  const clicked = e.target.closest(".ctrl-btn.features");
  if (!clicked) return;
  e.preventDefault();
  const parent = clicked.parentElement;
  ctrlBtnIndex = Array.prototype.indexOf.call(parent.children, clicked);

  FlashBlackout(BLACKOUT_STANDARD);
  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();
  ResetSectionVideos();
  ActivateSectionVideo("features", ctrlBtnIndex);
  PlaySectionVideo("features", ctrlBtnIndex);
  DeactivateActivateCurrentCtrlButtons("features", ctrlBtnIndex);

  setTimeout(() => {
    DeactivateActivateSectionText("feature", ctrlBtnIndex);
  }, DELAY_BEFORE_FEATURE_TEXT);
}

function ResetToFeaturesMainScreen() {
  setTimeout(() => {
    FlashBlackout(BLACKOUT_STANDARD);
    DeactivateActivateSectionImage();
    DeactivateActivateSectionText("main");
    ActivateSectionVideo("main");
    PlaySectionVideo("main");
    DeactivateActivateCurrentCtrlButtons("features", false);
  }, PAUSE_AFTER_FEATURE_END);
}

// ========== COMPONENTS Section ==========

allVidsComponentDatasheets.forEach((el) => {
  el.addEventListener("ended", () => {
    DisplayDataSheet();
  });
});

allVidsComponentViews.forEach((el) => {
  el.addEventListener("ended", () => {
    let startRange, endRange;
    if (currentViewName === "view-a") {
      startRange = COMP_BTNS_START_RANGE_A;
      endRange = COMP_BTNS_END_RANGE_A;
    } else {
      startRange = COMP_BTNS_START_RANGE_B;
      endRange = COMP_BTNS_END_RANGE_B;
    }
    DeactivateActivateSectionImage(currentViewName, ctrlBtnIndex);
    DeactivateActivateSectionText("main");
    ctrlBtnWrapperComponents
      .querySelectorAll(".ctrl-btn")
      .forEach((el) => el.classList.remove("active"));
    DeactivateActivateCtrlBtnRange("components", startRange, endRange);
    ctrlBtnWrapperComponents.classList.add("active");
  });
});

optsMenuBtn.addEventListener("click", (e) => {
  e.preventDefault();
  optsMenu.classList.add("active");
});
optsMenu.addEventListener("click", (e) => {
  const clicked = e.target.closest(".opts-menu_link");
  if (!clicked) return;
  optsMenu.classList.remove("active");
  const newView = clicked.textContent;
  if (currentViewName !== newView) {
    currentViewName = newView;
    optsMenuBtn.textContent = currentViewName;
    ctrlBtnIndex = null;
    DeactivateActivateSectionText();
    DeactivateActivateSectionImage();
    ResetSectionVideos();
    ActivateSectionVideo(currentViewName);
    PlaySectionVideo(currentViewName);
    ctrlBtnWrapperComponents.classList.remove("active");
  }
});

textImgBtn.addEventListener("click", (e) => {
  e.preventDefault();
  textImgBtnLabel = textImgBtnLabel === "image" ? "text" : "image";
  textImgBtn.textContent = textImgBtnLabel;
  if (activeDatasheet) {
    activeDatasheet
      .querySelector(".comp-data-body-wrap")
      .classList.toggle("active");
  }
  dimmer.classList.toggle("active");
});

ctrlBtnWrapper.addEventListener("click", handleCompCtrl);
ctrlBtnWrapper.addEventListener("touchstart", handleCompCtrl);

function handleCompCtrl(e) {
  const clicked = e.target.closest(".ctrl-btn.components");
  if (!clicked) return;
  e.preventDefault();
  const parentEl = clicked.parentElement;
  ctrlBtnIndex = Array.prototype.indexOf.call(parentEl.children, clicked);

  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();
  ResetSectionVideos();
  ActivateSectionVideo("datasheets", ctrlBtnIndex);
  PlaySectionVideo("datasheets", ctrlBtnIndex);
  ctrlBtnWrapperComponents.classList.remove("active");
}

ctrlBtnWrapper.addEventListener("click", (e) => {
  const clicked = e.target.closest(".ctrl-btn.back");
  if (!clicked) return;
  e.preventDefault();
  ResetSectionVideos("components", "datasheets");
  DeactivateActivateSectionImage(currentViewName);
  dimmer.classList.remove("active");
  ActivateDeactivateDatasheetTextAndButtons(false);
  DeactivateActivateSectionText("main");
  ActivateSection();
  ActivateSectionButtons();
});

function DisplayDataSheet() {
  DeactivateActivateSectionImage("comps", ctrlBtnIndex);
  dimmer.classList.add("active");
  ActivateDeactivateDatasheetTextAndButtons(true);
}

function ActivateDeactivateDatasheetTextAndButtons(activeDeactivate) {
  textImgBtn.classList.toggle("active", activeDeactivate);
  datasheetsAllWrapper.classList.toggle("active", activeDeactivate);
  allDatasheetWraps.forEach((el, idx) => {
    el.classList.remove("active");
    el.querySelector(".comp-data-body-wrap").classList.add("active");
    if (activeDeactivate && idx === ctrlBtnIndex) {
      el.classList.add("active");
      activeDatasheet = el;
    }
  });
  backBtn.classList.toggle("active", activeDeactivate);
}

// ========== INSTRUCTIONS Section ==========

allVidsInstructions.forEach((el) => {
  el.addEventListener("ended", () => {
    instructionVidTimer = setTimeout(() => {
      currentInstructionVid += 1;
      if (currentInstructionVid === NO_OF_INSTRUCTION_VIDS) {
        if (INSTRUCTION_VIDS_LOOPING) {
          currentInstructionVid = 0;
        } else {
          ResetToInstructionsMainScreen();
          return;
        }
      }
      FlashBlackout(BLACKOUT_STANDARD);
      ActivateSectionVideo("instructions", currentInstructionVid);
      el.classList.remove("active");
      el.pause();
      PlaySectionVideo("instructions", currentInstructionVid);
      DeactivateActivateCurrentCtrlButtons(
        "instructions",
        currentInstructionVid
      );
    }, PAUSE_BETWEEN_INSTRUCTION_VIDS);
  });
});

ctrlBtnWrapper.addEventListener("click", handleInstrCtrl);
ctrlBtnWrapper.addEventListener("touchstart", handleInstrCtrl);

function handleInstrCtrl(e) {
  const clicked = e.target.closest(".ctrl-btn.instructions");
  if (!clicked) return;
  e.preventDefault();

  const parentEl = clicked.parentElement;
  currentInstructionVid = Array.prototype.indexOf.call(
    parentEl.children,
    clicked
  );

  if (instructionVidTimer) {
    clearTimeout(instructionVidTimer);
    instructionVidTimer = null;
  }

  blackout.classList.remove("off");
  ActivateSectionVideo("instructions", currentInstructionVid);
  ResetSectionVideos();
  DeactivateActivateSectionText();
  DeactivateActivateSectionImage();

  setTimeout(() => {
    blackout.classList.add("off");
  }, 20);

  PlaySectionVideo("instructions", currentInstructionVid);
  DeactivateActivateCurrentCtrlButtons("instructions", currentInstructionVid);
}

function ResetToInstructionsMainScreen() {
  FlashBlackout(BLACKOUT_EXTRA);
  DeactivateSectionVideos();
  DeactivateActivateSectionText("main");
  DeactivateActivateSectionImage("main");
  DeactivateActivateCurrentCtrlButtons("instructions", false);
}
