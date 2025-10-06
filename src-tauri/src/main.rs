// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    hoe_app_lib::run()
}

// 我想提供一个控制鼠标的接口
