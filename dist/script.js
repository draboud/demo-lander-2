(() => {
  // script.js
  console.log("TEST-2");
  var BLACKOUT_SECTION = 50;
  var BLACKOUT_STANDARD = 150;
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
  var viewBtnName;
  allNavLinks.forEach(function(el) {
    el.addEventListener("click", function(e) {
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
        ActivateDeactivateSectionImage("assemble");
        viewBtn.textContent = "explode";
        [datasheetsAllWrapper, ...allDatasheetWraps].forEach(function(el) {
          el.classList.remove("active");
        });
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
  var ActivateDeactivateSectionText = function(textName) {
    activeSection.querySelectorAll(".section-wrap-text").forEach(function(el) {
      el.classList.remove("active");
      if (textName && el.classList.contains(textName)) el.classList.add("active");
    });
  };
  var ActivateDeactivateSectionImage = function(imgName, imgIndex) {
    activeSection.querySelectorAll(".section-wrap-imgs").forEach(function(el) {
      el.classList.remove("active");
      if (imgName && el.classList.contains(imgName)) {
        el.classList.add("active");
        if (imgIndex || imgIndex === 0) {
          el.querySelectorAll(".section-img").forEach(function(el2) {
            el2.classList.remove("active");
          });
          el.querySelectorAll(".section-img.mobile-p").forEach(function(el2) {
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
  var ResetSectionVideos = function(sectionName) {
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
    } else {
      document.querySelector(`.section_${sectionName}`).querySelectorAll(`.vid,.vid-mobile-p`).forEach(function(el) {
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
    ActivateDeactivateSectionText();
    ActivateDeactivateSectionImage();
    ResetSectionVideos();
    ActivateSectionVideo("features", ctrlBtnIndex);
    PlaySectionVideo("features", ctrlBtnIndex);
  });
  var ResetToFeaturesMainScreen = function() {
    setTimeout(function() {
      DeactivateSectionVideos();
      ActivateDeactivateSectionText("main");
      ActivateDeactivateSectionImage("main");
    }, PAUSE_FEATURE_END);
  };
  allVidsComponentDatasheets.forEach(function(el) {
    el.addEventListener("ended", function() {
      DisplayDataSheet();
    });
  });
  allVidsComponentViews.forEach(function(el) {
    el.addEventListener("ended", function() {
      const oldViewBtnName = viewBtnName;
      viewBtnName === "explode" ? viewBtnName = "assemble" : viewBtnName = "explode";
      viewBtn.textContent = viewBtnName;
      ActivateDeactivateSectionText("main");
      ActivateDeactivateSectionImage(oldViewBtnName, ctrlBtnIndex);
      ctrlBtnWrapperComponents.classList.add("active");
    });
  });
  viewBtn.addEventListener("click", function(e) {
    viewBtnName = viewBtn.textContent;
    FlashBlackout(BLACKOUT_STANDARD);
    ActivateDeactivateSectionText();
    ActivateDeactivateSectionImage();
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
    FlashBlackout(BLACKOUT_STANDARD);
    ActivateDeactivateSectionText();
    ActivateDeactivateSectionImage();
    ResetSectionVideos();
    ActivateSectionVideo("datasheets", ctrlBtnIndex);
    PlaySectionVideo("datasheets", ctrlBtnIndex);
    ctrlBtnWrapperComponents.classList.remove("active");
  });
  var DisplayDataSheet = function() {
    ActivateDeactivateSectionImage("comps", ctrlBtnIndex);
    ActivateDatasheetTextAndButton();
  };
  var ActivateDatasheetTextAndButton = function() {
    datasheetsAllWrapper.classList.add("active");
    allDatasheetWraps.forEach(function(el, index) {
      el.classList.remove("active");
      if (index === ctrlBtnIndex) el.classList.add("active");
    });
    datasheetBtn.classList.add("active");
  };
})();
