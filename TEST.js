"use strict"

// register the application module
b4w.register("TEST_main", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
var m_ver       = require("version");
var m_input     = require("input");
var m_armature  = require("armature");
var m_tsr		= require("tsr");
var m_scene		= require("scenes");

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("TEST");

//Custom variables
var boxIsOpen = false;
var final_tsr = new Float32Array(8);

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load(APP_ASSETS_PATH + "TEST.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();
	
	m_input.add_click_listener(document.getElementById("Open_Close_Button"), function() {
		var boxRig = m_scene.get_object_by_name("Cube_Armature");
		var boxTSR_close = m_tsr.from_values(0, 0, 0, 1, 0, 0, 0, 1);
		var boxTSR_open = m_tsr.from_values(0, 0, 0, 1, 0.819, 0, 0, 0.573);
	
		m_tsr.interpolate(boxTSR_close, boxTSR_open, boxIsOpen? 0: 1, final_tsr);
		m_armature.set_bone_tsr_rel(boxRig, "Cube_Bone", final_tsr);
		boxIsOpen = !boxIsOpen;
	});
}
});

// import the app module and start the app by calling the init method
b4w.require("TEST_main").init();