(() => {
  // script.js
  var BLACKOUT_SECTION = 50;
  var PAUSE_FEATURE_END = 1e3;
  var allNavLinks = document.querySelectorAll(".nav_menu_link");
  var blackout = document.querySelector(".blackout");
  var sectionFeatures = document.querySelector(".section_features");
  var sectionComponents = document.querySelector(".section_components");
  var sectionInstructions = document.querySelector(".section_instructions");
  var allSections = [sectionFeatures, sectionComponents, sectionInstructions];
  var ctrlBtnWrapper = document.querySelector(".ctrl-btn-wrapper");
  var allSectionBtnWrappers = document.querySelectorAll(".section-wrap-btns");
  var activeSection = document.querySelector(".section_features");
  var activeSectionName = activeSection.classList[0].slice(8);
  var ctrlBtnIndex;
  var allVidsFeatures = sectionFeatures.querySelectorAll(".vid");
  var allVidsComponentViews = [
    document.querySelector(".section-wrap-vids.explode").querySelector(".vid"),
    document.querySelector(".section-wrap-vids.assemble").querySelector(".vid")
  ];
  var allVidsComponentDatasheets = sectionComponents.querySelector(".section-wrap-vids.datasheets").querySelectorAll(".vid");
  var datasheetsAllWrapper = sectionComponents.querySelector(
    ".section-wrap-comp-data"
  );
  var allDatasheetWraps = sectionComponents.querySelectorAll(".comp-data-wrap");
  var ctrlBtnWrapperComponents = ctrlBtnWrapper.querySelector(
    ".section-wrap-btns.components"
  );
  var viewBtn = document.querySelector(".view-btn");
  var allCtrlBtnsComponents = ctrlBtnWrapper.querySelectorAll(
    ".ctrl-btn.components"
  );
  var datasheetBtn = ctrlBtnWrapper.querySelector(".ctrl-btn.datasheets");
  var oldViewBtnName = "assemble";
  var viewBtnName = "explode";
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
        ActivateDeactivateCtrlBtnRange(true, "components", startIndex, endIndex);
        ActivateDeactivateCtrlBtnRange(false, "components", startIndex, endIndex);
        break;
      case "instructions":
        break;
    }
  };
  var ActivateSection = function() {
    allSections.forEach(function(el) {
      el.classList.remove("active");
      if (el.classList[0].slice(8) === activeSectionName) {
        el.classList.add("active");
        FlashBlackout(BLACKOUT_SECTION);
      }
    });
  };
  var FlashBlackout = function(timerVariable) {
    blackout.classList.remove("off");
    setTimeout(function() {
      blackout.classList.add("off");
    }, timerVariable);
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
  var ActivateSectionButtons = function() {
    allSectionBtnWrappers.forEach(function(el) {
      el.classList.remove("active");
    });
    ctrlBtnWrapper.querySelector(`.section-wrap-btns.${activeSectionName}`).classList.add("active");
    datasheetBtn.classList.remove("active");
  };
  var ActivateDeactivateCtrlBtnRange = function(activeDeactivate, btnsName, startIndex2, endIndex2) {
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
  });
  var ResetToFeaturesMainScreen = function() {
    setTimeout(function() {
      DeactivateSectionVideos();
      DeactivateActivateSectionText("main");
      DeactivateActivateSectionImage("main");
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
      ActivateDeactivateCtrlBtnRange(true, "components", startRange, endRange);
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
    ActivateDeactivateDatasheetTextAndButton(false);
    DeactivateActivateSectionText("main");
    ActivateSection();
    ActivateSectionButtons();
  });
  var DisplayDataSheet = function() {
    DeactivateActivateSectionImage("comps", ctrlBtnIndex);
    ActivateDeactivateDatasheetTextAndButton(true);
  };
  var ActivateDeactivateDatasheetTextAndButton = function(activeDeactivate) {
    datasheetsAllWrapper.classList.toggle("active", activeDeactivate);
    allDatasheetWraps.forEach(function(el, index) {
      el.classList.remove("active");
      if (activeDeactivate && index === ctrlBtnIndex) el.classList.add("active");
    });
    datasheetBtn.classList.toggle("active", activeDeactivate);
  };
})();
