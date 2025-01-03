use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct WidgetStyle {
    background_color: Option<String>,
    border_color: Option<String>,
    text_color: Option<String>,
    font_size: Option<i32>,
    font_family: Option<String>,
    rotation: Option<f32>,
    opacity: Option<f32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Widget {
    id: String,
    widget_type: String,
    content: String,
    position: Position,
    size: Size,
    style: WidgetStyle,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Position {
    x: f32,
    y: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Size {
    width: f32,
    height: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct CanvasSettings {
    background_color: String,
    grid_enabled: bool,
    grid_size: i32,
    snap_to_grid: bool,
    zoom_level: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct CanvasSize {
    width: i32,
    height: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct CanvasData {
    theme: String,
    settings: CanvasSettings,
    widgets: Vec<Widget>,
    canvas_size: CanvasSize,
}

impl Default for CanvasData {
    fn default() -> Self {
        Self {
            theme: "light".to_string(),
            settings: CanvasSettings {
                background_color: "#ffffff".to_string(),
                grid_enabled: true,
                grid_size: 20,
                snap_to_grid: false,
                zoom_level: 1.0,
            },
            canvas_size: CanvasSize {
                width: 1920,
                height: 1080,
            },
            widgets: Vec::new(),
        }
    }
}

// Helper functions for file operations
fn get_canvas_file_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let app_dir = app_handle.path().app_local_data_dir()
        .map_err(|e| e.to_string())?;
    Ok(app_dir.join("canvas_state.json"))
}

fn get_header_image_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let app_dir = app_handle.path().app_local_data_dir()
        .map_err(|e| format!("Failed to get app directory: {}", e))?;
    Ok(app_dir.join("header_image"))
}

#[tauri::command]
async fn save_canvas_state(app_handle: AppHandle, canvas_data: CanvasData) -> Result<(), String> {
    let canvas_file = get_canvas_file_path(&app_handle)?;
    
    if let Some(parent) = canvas_file.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create app directory: {}", e))?;
    }
    
    let json_data = serde_json::to_string_pretty(&canvas_data)
        .map_err(|e| format!("Failed to serialize canvas data: {}", e))?;
    
    fs::write(canvas_file, json_data)
        .map_err(|e| format!("Failed to write canvas data: {}", e))
}

#[tauri::command]
async fn load_canvas_state(app_handle: AppHandle) -> Result<CanvasData, String> {
    let canvas_file = get_canvas_file_path(&app_handle)?;
    
    if !canvas_file.exists() {
        return Ok(CanvasData::default());
    }
    
    let json_data = fs::read_to_string(canvas_file)
        .map_err(|e| format!("Failed to read canvas data: {}", e))?;
    
    serde_json::from_str(&json_data)
        .map_err(|e| format!("Failed to deserialize canvas data: {}", e))
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn save_header_image(app_handle: AppHandle, image_data: String) -> Result<(), String> {
    let image_path = get_header_image_path(&app_handle)?;
    
    // Create directory if it doesn't exist
    if let Some(parent) = image_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    
    // Remove "data:image/..." prefix and get raw base64
    let base64_data = image_data.split(",").nth(1)
        .ok_or_else(|| "Invalid image data format".to_string())?;
    
    // Decode base64 to bytes
    let image_bytes = BASE64.decode(base64_data)
        .map_err(|e| format!("Failed to decode image data: {}", e))?;
    
    // Write to file
    fs::write(&image_path, image_bytes)
        .map_err(|e| format!("Failed to write image file: {}", e))?;
    
    Ok(())
}

#[tauri::command]
async fn load_header_image(app_handle: AppHandle) -> Result<Option<String>, String> {
    let image_path = get_header_image_path(&app_handle)?;
    
    if !image_path.exists() {
        return Ok(None);
    }
    
    // Read file
    let image_bytes = fs::read(&image_path)
        .map_err(|e| format!("Failed to read image file: {}", e))?;
    
    // Convert to base64
    let base64_data = BASE64.encode(&image_bytes);
    
    // Add proper data URL prefix based on file type (assuming PNG for now)
    Ok(Some(format!("data:image/png;base64,{}", base64_data)))
}

#[tauri::command]
async fn delete_header_image(app_handle: AppHandle) -> Result<(), String> {
    let image_path = get_header_image_path(&app_handle)?;
    
    if image_path.exists() {
        fs::remove_file(&image_path)
            .map_err(|e| format!("Failed to delete image file: {}", e))?;
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            save_canvas_state,
            load_canvas_state,
            save_header_image,
            load_header_image,
            delete_header_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}