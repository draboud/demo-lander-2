(() => {
  // script.js
  var BLACKOUT_STANDARD = 50;
  var BLACKOUT_EXTRA = 150;
  var BLACKOUT_INIT = 2500;
  var DELAY_BEFORE_FEATURE_TEXT = 1e3;
  var PAUSE_AFTER_FEATURE_END = 650;
  var NO_OF_INSTRUCTION_VIDS = 4;
  var PAUSE_BETWEEN_INSTRUCTION_VIDS = 1500;
  var INSTRUCTION_VIDS_LOOPING = true;
  var COMP_BTNS_START_RANGE_A = 0;
  var COMP_BTNS_END_RANGE_A = 5;
  var COMP_BTNS_START_RANGE_B = 6;
  var COMP_BTNS_END_RANGE_B = 11;
  var navBar = document.querySelector(".nav_fixed");
  var navLinkFeatures = document.querySelector(".nav_menu_link.features");
  var navLinkComponents = document.querySelector(".nav_menu_link.components");
  var navLinkInstructions = document.querySelector(
    ".nav_menu_link.instructions"
  );
  var allNavLinks = document.querySelectorAll(".nav_menu_link");
  var loader = document.querySelector(".loader-text");
  var blackout = document.querySelector(".blackout");
  var sectionFeatures = document.querySelector(".section_features");
  var sectionComponents = document.querySelector(".section_components");
  var sectionInstructions = document.querySelector(".section_instructions");
  var allSections = [sectionFeatures, sectionComponents, sectionInstructions];
  var ctrlBtnWrapper = document.querySelector(".ctrl-btn-wrapper");
  var allCtrlBtns = document.querySelectorAll(".ctrl-btn");
  var allSectionBtnWrappers = document.querySelectorAll(".section-wrap-btns");
  var initializing = true;
  var activeSection = document.querySelector(".section_features");
  var activeSectionName = activeSection.classList[0].slice(8);
  var ctrlBtnIndex;
  var allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
  var allCtrlBtnsFeatures = ctrlBtnWrapper.querySelectorAll(".ctrl-btn.features");
  var allVidsComponentViews = [
    sectionComponents.querySelector(".section-wrap-vids.view-a").querySelector(".vid"),
    sectionComponents.querySelector(".section-wrap-vids.view-b").querySelector(".vid")
  ];
  var allVidsComponentDatasheets = sectionComponents.querySelector(".section-wrap-vids.datasheets").querySelectorAll(".vid");
  var datasheetsAllWrapper = sectionComponents.querySelector(
    ".section-wrap-comp-data"
  );
  var allDatasheetWraps = sectionComponents.querySelectorAll(".comp-data-wrap");
  var ctrlBtnWrapperComponents = ctrlBtnWrapper.querySelector(
    ".section-wrap-btns.components"
  );
  var optsMenuBtn = sectionComponents.querySelector(".opts-menu_btn");
  var optsMenu = sectionComponents.querySelector(".opts-menu");
  var dimmer = sectionComponents.querySelector(".dimmer");
  var textImgBtn = sectionComponents.querySelector(".text-img-btn");
  var allCtrlBtnsComponents = ctrlBtnWrapper.querySelectorAll(
    ".ctrl-btn.components"
  );
  var backBtn = ctrlBtnWrapper.querySelector(".ctrl-btn.back");
  var currentViewName = "view-a";
  var textImgBtnLabel = "image";
  var activeDatasheet;
  var allVidsInstructions = sectionInstructions.querySelectorAll(".vid");
  var allCtrlBtnsInstructions = sectionInstructions.querySelectorAll(
    ".ctrl-btn.instructions"
  );
  var currentInstructionVid;
  var instructionVidTimer;
  var init = function() {
    blackout.classList.remove("off");
    loader.classList.add("active");
    navBar.style.display = "none";
    ctrlBtnWrapper.classList.remove("active");
  };
  init();
  window.addEventListener("load", function() {
    navLinkInstructions.click();
    navLinkComponents.click();
    navLinkFeatures.click();
    this.setTimeout(function() {
      navBar.style.display = "block";
      ctrlBtnWrapper.classList.add("active");
      initializing = false;
      loader.classList.remove("active");
      blackout.classList.add("off");
    }, BLACKOUT_INIT);
  });
  allCtrlBtns.forEach(function(el) {
    el.addEventListener("mouseenter", function() {
      el.classList.add("hovered");
    });
  });
  allCtrlBtns.forEach(function(el) {
    el.addEventListener("mouseleave", function() {
      el.classList.remove("hovered");
    });
  });
  allNavLinks.forEach(function(el) {
    el.addEventListener("click", function(e) {
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
  var ActivateNavLink = function() {
    allNavLinks.forEach(function(el) {
      el.classList.remove("current");
      if (el.classList.contains(activeSectionName)) el.classList.add("current");
    });
  };
  var ResetSectionSpecial = function() {
    switch (activeSectionName) {
      case "features":
        ActivateSectionVideo("main");
        DeactivateActivateCurrentCtrlButtons("features");
        break;
      case "components":
        optsMenu.classList.remove("active");
        DeactivateActivateSectionImage(currentViewName);
        [datasheetsAllWrapper, ...allDatasheetWraps].forEach(function(el) {
          el.classList.remove("active");
        });
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
        clearTimeout(instructionVidTimer);
        instructionVidTimer = null;
        DeactivateActivateSectionImage("main");
        DeactivateActivateCurrentCtrlButtons("instructions");
        break;
    }
  };
  var ResetSectionVideos = function(sectionName, subsectionName, vidIndex) {
    if (sectionName === "all") {
      document.querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    } else if (!sectionName) {
      activeSection.querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    } else if (sectionName && !subsectionName) {
      document.querySelector(`.section_${sectionName}`).querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    } else if (sectionName && subsectionName) {
      document.querySelector(`.section_${sectionName}`).querySelector(`.section-wrap-vids.${subsectionName}`).querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
        el.currentTime = 0;
        el.pause();
      });
    }
  };
  var DeactivateActivateSectionText = function(textName, textIndex) {
    activeSection.querySelectorAll(".section-wrap-text").forEach(function(el) {
      el.classList.remove("active");
      if (textName && el.classList.contains(textName)) {
        el.classList.add("active");
        if (textIndex || textIndex === 0) {
          el.querySelectorAll(".text-wrapper").forEach(function(el2, index) {
            el2.classList.remove("active");
            if (index === textIndex) el2.classList.add("active");
          });
        }
      }
    });
  };
  var ActivateSection = function() {
    allSections.forEach(function(el) {
      el.classList.remove("active");
      if (el.classList[0].slice(8) === activeSectionName) {
        el.classList.add("active");
        if (!initializing) FlashBlackout(BLACKOUT_STANDARD);
      }
    });
  };
  var ActivateSectionButtons = function() {
    allSectionBtnWrappers.forEach(function(el) {
      el.classList.remove("active");
    });
    ctrlBtnWrapper.querySelector(`.section-wrap-btns.${activeSectionName}`).classList.add("active");
    backBtn.classList.remove("active");
  };
  var FlashBlackout = function(timerVariable) {
    blackout.classList.remove("off");
    setTimeout(function() {
      blackout.classList.add("off");
    }, timerVariable);
  };
  var DeactivateActivateSectionImage = function(imgName, imgIndex) {
    activeSection.querySelectorAll(".section-wrap-imgs").forEach(function(el) {
      el.classList.remove("active");
      if (imgName && el.classList.contains(imgName)) {
        el.classList.add("active");
        if (imgIndex || imgIndex === 0) {
          el.querySelectorAll(".section-img").forEach(function(el2, index) {
            el2.classList.remove("active");
            if (index === imgIndex) el2.classList.add("active");
          });
          el.querySelectorAll(".section-img.mobile-p").forEach(function(el2, index) {
            el2.classList.remove("active");
            if (index === imgIndex) el2.classList.add("active");
          });
        }
      }
    });
  };
  var DeactivateSectionVideos = function(sectionName) {
    if (!sectionName) {
      activeSection.querySelectorAll(".video-wrap").forEach(function(el) {
        el.classList.remove("active");
      });
    } else {
      document.querySelector(`.section_${sectionName}`).querySelectorAll(".video-wrap").forEach(function(el) {
        el.classList.remove("active");
      });
    }
  };
  var ActivateSectionVideo = function(vidName, vidIndex) {
    DeactivateSectionVideos();
    if (!vidIndex) vidIndex = 0;
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap")[vidIndex].classList.add("active");
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap.mobile-p")[vidIndex].classList.add("active");
  };
  var PlaySectionVideo = function(vidName, vidIndex) {
    if (!vidIndex) vidIndex = 0;
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap")[vidIndex].querySelector(".vid").play();
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap.mobile-p")[vidIndex].querySelector(".vid-mobile-p").play();
  };
  var DeactivateActivateCurrentCtrlButtons = function(sectionName, btnIndex) {
    document.querySelectorAll(`.ctrl-btn.${sectionName}`).forEach(function(el, index) {
      el.classList.remove("current", "hovered");
      if ((btnIndex || btnIndex === 0) && index === btnIndex)
        el.classList.add("current");
    });
  };
  var DeactivateActivateCtrlBtnRange = function(btnsName, startIndex2, endIndex2) {
    ctrlBtnWrapper.querySelector(`.section-wrap-btns.${btnsName}`).querySelectorAll(".ctrl-btn").forEach(function(el, index) {
      el.classList.remove("active");
      if (index >= startIndex2 && index <= endIndex2) el.classList.add("active");
    });
  };
  allVidsFeatures.forEach(function(el) {
    el.addEventListener("ended", function() {
      ResetToFeaturesMainScreen();
    });
  });
  ctrlBtnWrapper.addEventListener("click", function(e) {
    const clicked = e.target.closest(".ctrl-btn.features");
    if (!clicked) return;
    const parentElement = clicked.parentElement;
    ctrlBtnIndex = Array.prototype.indexOf.call(parentElement.children, clicked);
    FlashBlackout(BLACKOUT_STANDARD);
    DeactivateActivateSectionText();
    DeactivateActivateSectionImage();
    ResetSectionVideos();
    ActivateSectionVideo("features", ctrlBtnIndex);
    PlaySectionVideo("features", ctrlBtnIndex);
    DeactivateActivateCurrentCtrlButtons("features", ctrlBtnIndex);
    setTimeout(function() {
      DeactivateActivateSectionText("feature", ctrlBtnIndex);
    }, DELAY_BEFORE_FEATURE_TEXT);
  });
  var ResetToFeaturesMainScreen = function() {
    setTimeout(function() {
      FlashBlackout(BLACKOUT_STANDARD);
      DeactivateActivateSectionImage();
      DeactivateActivateSectionText("main");
      ActivateSectionVideo("main");
      PlaySectionVideo("main");
      DeactivateActivateCurrentCtrlButtons("features", false);
    }, PAUSE_AFTER_FEATURE_END);
  };
  allVidsComponentDatasheets.forEach(function(el) {
    el.addEventListener("ended", function() {
      DisplayDataSheet();
    });
  });
  allVidsComponentViews.forEach(function(el) {
    el.addEventListener("ended", function() {
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
      ctrlBtnWrapperComponents.querySelectorAll(".ctrl-btn").forEach(function(el2) {
        el2.classList.remove("active");
      });
      DeactivateActivateCtrlBtnRange("components", startRange, endRange);
      ctrlBtnWrapperComponents.classList.add("active");
    });
  });
  optsMenuBtn.addEventListener("click", function() {
    optsMenu.classList.add("active");
  });
  optsMenu.addEventListener("click", function(e) {
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
  textImgBtn.addEventListener("click", function() {
    textImgBtnLabel === "image" ? textImgBtn.textContent = "text" : textImgBtn.textContent = "image";
    textImgBtnLabel = textImgBtn.textContent;
    activeDatasheet.querySelector(".comp-data-body-wrap").classList.toggle("active");
    dimmer.classList.toggle("active");
  });
  ctrlBtnWrapper.addEventListener("click", function(e) {
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
  ctrlBtnWrapper.addEventListener("click", function(e) {
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
  var DisplayDataSheet = function() {
    DeactivateActivateSectionImage("comps", ctrlBtnIndex);
    dimmer.classList.add("active");
    ActivateDeactivateDatasheetTextAndButtons(true);
  };
  var ActivateDeactivateDatasheetTextAndButtons = function(activeDeactivate) {
    textImgBtn.classList.toggle("active", activeDeactivate);
    datasheetsAllWrapper.classList.toggle("active", activeDeactivate);
    allDatasheetWraps.forEach(function(el, index) {
      el.classList.remove("active");
      el.querySelector(".comp-data-body-wrap").classList.add("active");
      if (activeDeactivate && index === ctrlBtnIndex) {
        el.classList.add("active");
        activeDatasheet = el;
      }
    });
    backBtn.classList.toggle("active", activeDeactivate);
  };
  allVidsInstructions.forEach(function(el) {
    el.addEventListener("ended", function() {
      instructionVidTimer = setTimeout(function() {
        currentInstructionVid += 1;
        if (currentInstructionVid === NO_OF_INSTRUCTION_VIDS && INSTRUCTION_VIDS_LOOPING) {
          currentInstructionVid = 0;
        } else if (currentInstructionVid === NO_OF_INSTRUCTION_VIDS && !INSTRUCTION_VIDS_LOOPING) {
          ResetToInstructionsMainScreen();
          return;
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
  ctrlBtnWrapper.addEventListener("click", function(e) {
    const clicked = e.target.closest(".ctrl-btn.instructions");
    if (!clicked) return;
    const parentElement = clicked.parentElement;
    currentInstructionVid = Array.prototype.indexOf.call(
      parentElement.children,
      clicked
    );
    clearTimeout(instructionVidTimer);
    instructionVidTimer = null;
    FlashBlackout(BLACKOUT_STANDARD);
    ActivateSectionVideo("instructions", currentInstructionVid);
    ResetSectionVideos();
    DeactivateActivateSectionText();
    DeactivateActivateSectionImage();
    PlaySectionVideo("instructions", currentInstructionVid);
    DeactivateActivateCurrentCtrlButtons("instructions", currentInstructionVid);
  });
  var ResetToInstructionsMainScreen = function() {
    FlashBlackout(BLACKOUT_EXTRA);
    DeactivateSectionVideos();
    DeactivateActivateSectionText("main");
    DeactivateActivateSectionImage("main");
    DeactivateActivateCurrentCtrlButtons("instructions", false);
  };
})();
