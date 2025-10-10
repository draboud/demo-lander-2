(() => {
  // script.js
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
  var allVidsComponents = sectionComponents.querySelectorAll(".vid");
  allNavLinks.forEach(function(el) {
    el.addEventListener("click", function(e) {
      const clicked = e.target.closest(".nav_menu_link");
      if (!clicked) return;
      activeSectionName = clicked.classList[1];
      ResetSectionVideos("all");
      ActivateNavLink();
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
  var ActivateSection = function() {
    allSections.forEach(function(el) {
      el.classList.remove("active");
      if (el.classList[0].slice(8) === activeSectionName) {
        el.classList.add("active");
        activeSection = el;
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
        if (imgIndex) {
          el.querySelectorAll(".section-img")[imgIndex].classList.add("active");
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
  var ActivateSectionVideo = function(vidName) {
    DeactivateSectionVideos();
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap")[ctrlBtnIndex].classList.add("active");
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap.mobile-p")[ctrlBtnIndex].classList.add("active");
  };
  var PlaySectionVideo = function(vidName) {
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap")[ctrlBtnIndex].querySelector(".vid").play();
    activeSection.querySelector(`.section-wrap-vids.${vidName}`).querySelectorAll(".video-wrap.mobile-p")[ctrlBtnIndex].querySelector(".vid-mobile-p").play();
  };
  var ActivateSectionButtons = function() {
    allSectionBtnWrappers.forEach(function(el) {
      el.classList.remove("active");
    });
    ctrlBtnWrapper.querySelector(`.section-wrap-btns.${activeSectionName}`).classList.add("active");
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
    ActivateSectionVideo("features");
    PlaySectionVideo("features");
  });
  var ResetToFeaturesMainScreen = function() {
    setTimeout(function() {
      DeactivateSectionVideos();
      ActivateDeactivateSectionText("main");
      ActivateDeactivateSectionImage("main");
    }, PAUSE_FEATURE_END);
  };
  allVidsComponents.forEach(function(el) {
    el.addEventListener("ended", function() {
      DisplayDataSheet();
    });
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
    ActivateSectionVideo("datasheets");
    PlaySectionVideo("datasheets");
  });
  var DisplayDataSheet = function() {
    ActivateDeactivateSectionImage("comps", ctrlBtnIndex);
  };
})();
