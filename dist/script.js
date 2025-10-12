(() => {
  // script.js
  var BLACKOUT_STANDARD = 50;
  var BLACKOUT_INIT = 2500;
  var PAUSE_FEATURE_END = 1e3;
  var NO_OF_INSTRUCTION_VIDS = 4;
  var PAUSE_BETWEEN_INSTRUCTION_VIDS = 1500;
  var INSTRUCTION_VIDS_LOOPING = true;
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
    sectionComponents.querySelector(".section-wrap-vids.explode").querySelector(".vid"),
    sectionComponents.querySelector(".section-wrap-vids.assemble").querySelector(".vid")
  ];
  var allVidsComponentDatasheets = sectionComponents.querySelector(".section-wrap-vids.datasheets").querySelectorAll(".vid");
  var datasheetsAllWrapper = sectionComponents.querySelector(
    ".section-wrap-comp-data"
  );
  var allDatasheetWraps = sectionComponents.querySelectorAll(".comp-data-wrap");
  var ctrlBtnWrapperComponents = ctrlBtnWrapper.querySelector(
    ".section-wrap-btns.components"
  );
  var viewBtn = sectionComponents.querySelector(".view-btn");
  var dimmer = sectionComponents.querySelector(".dimmer");
  var textImgBtn = sectionComponents.querySelector(".text-img-btn");
  var allCtrlBtnsComponents = ctrlBtnWrapper.querySelectorAll(
    ".ctrl-btn.components"
  );
  var datasheetBtn = ctrlBtnWrapper.querySelector(".ctrl-btn.datasheets");
  var oldViewBtnName = "assemble";
  var viewBtnName = "explode";
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
    navLinkComponents.click();
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
        DeactivateActivateSectionImage("main");
        DeactivateActivateCurrentCtrlButtons("features");
        break;
      case "components":
        DeactivateActivateSectionImage(oldViewBtnName);
        viewBtn.textContent = viewBtnName;
        [datasheetsAllWrapper, ...allDatasheetWraps].forEach(function(el) {
          el.classList.remove("active");
        });
        if (oldViewBtnName === "assemble") {
          startIndex = 6;
          endIndex = 11;
        } else {
          startIndex = 0;
          endIndex = 5;
        }
        dimmer.classList.remove("active");
        textImgBtn.textContent = "image";
        textImgBtnLabel = "image";
        DeactivateActivateCtrlBtnRange(true, "components", startIndex, endIndex);
        DeactivateActivateCtrlBtnRange(false, "components", startIndex, endIndex);
        break;
      case "instructions":
        clearTimeout(instructionVidTimer);
        instructionVidTimer = null;
        DeactivateActivateSectionImage("main");
        DeactivateActivateCurrentCtrlButtons("instructions");
        break;
    }
  };
  var ResetSectionVideos = function(sectionName, subsectionName) {
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
    } else {
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
    datasheetBtn.classList.remove("active");
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
  var DeactivateActivateCtrlBtnRange = function(activeDeactivate, btnsName, startIndex2, endIndex2) {
    ctrlBtnWrapper.querySelector(`.section-wrap-btns.${btnsName}`).querySelectorAll(".ctrl-btn").forEach(function(el, index) {
      if (index >= startIndex2 && index <= endIndex2)
        el.classList.toggle("active", activeDeactivate);
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
    ActivateSectionVideo("features", ctrlBtnIndex);
    DeactivateActivateSectionText("feature", ctrlBtnIndex);
    DeactivateActivateSectionImage();
    ResetSectionVideos();
    PlaySectionVideo("features", ctrlBtnIndex);
    DeactivateActivateCurrentCtrlButtons("features", ctrlBtnIndex);
  });
  var ResetToFeaturesMainScreen = function() {
    setTimeout(function() {
      FlashBlackout(50);
      DeactivateSectionVideos();
      DeactivateActivateSectionText("main");
      DeactivateActivateSectionImage("main");
      DeactivateActivateCurrentCtrlButtons("features", false);
    }, PAUSE_FEATURE_END);
  };
  allVidsComponentDatasheets.forEach(function(el) {
    el.addEventListener("ended", function() {
      DisplayDataSheet();
    });
  });
  allVidsComponentViews.forEach(function(el) {
    el.addEventListener("ended", function() {
      oldViewBtnName = viewBtnName;
      viewBtnName === "explode" ? viewBtnName = "assemble" : viewBtnName = "explode";
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
      ctrlBtnWrapperComponents.querySelectorAll(".ctrl-btn").forEach(function(el2) {
        el2.classList.remove("active");
      });
      DeactivateActivateCtrlBtnRange(true, "components", startRange, endRange);
      ctrlBtnWrapperComponents.classList.add("active");
    });
  });
  viewBtn.addEventListener("click", function(e) {
    viewBtnName = viewBtn.textContent;
    ctrlBtnIndex = "";
    DeactivateActivateSectionText();
    DeactivateActivateSectionImage();
    ResetSectionVideos();
    ActivateSectionVideo(viewBtnName);
    PlaySectionVideo(viewBtnName);
    ctrlBtnWrapperComponents.classList.remove("active");
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
    const clicked = e.target.closest(".ctrl-btn.datasheets");
    if (!clicked) return;
    ResetSectionVideos("components", "datasheets");
    DeactivateActivateSectionImage(oldViewBtnName);
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
    datasheetBtn.classList.toggle("active", activeDeactivate);
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
  ctrlBtnWrapper.addEventListener("click", function(e) {
    const clicked = e.target.closest(".ctrl-btn.instructions");
    if (!clicked) return;
    const parentElement = clicked.parentElement;
    currentInstructionVid = Array.prototype.indexOf.call(
      parentElement.children,
      clicked
    );
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
  var ResetToInstructionsMainScreen = function() {
    FlashBlackout(BLACKOUT_STANDARD);
    DeactivateSectionVideos();
    DeactivateActivateSectionText("main");
    DeactivateActivateSectionImage("main");
    DeactivateActivateCurrentCtrlButtons("instructions", false);
  };
})();
