//! Names a game Windows recognised but no launcher manifest describes, from what
//! its executable declares about itself. On Windows that
//! is the `FileDescription` of the version-info resource — the string Task
//! Manager shows — with `ProductName` as a fallback. Other platforms have no
//! equivalent that is cheap to read, so they resolve nothing.

#[cfg(not(windows))]
pub fn display_name(_path: &std::path::Path) -> Option<String> {
    None
}

#[cfg(windows)]
pub fn display_name(path: &std::path::Path) -> Option<String> {
    let block = version_info_block(path)?;
    let language = translation(&block).unwrap_or(DEFAULT_TRANSLATION);

    ["FileDescription", "ProductName"]
        .into_iter()
        .find_map(|field| string_value(&block, language, field))
}

#[cfg(windows)]
const DEFAULT_TRANSLATION: (u16, u16) = (0x0409, 0x04b0);

#[cfg(windows)]
fn version_info_block(path: &std::path::Path) -> Option<Vec<u8>> {
    use windows_sys::Win32::Storage::FileSystem::{GetFileVersionInfoSizeW, GetFileVersionInfoW};

    let wide = to_wide(path.as_os_str());

    let size = unsafe { GetFileVersionInfoSizeW(wide.as_ptr(), std::ptr::null_mut()) };

    if size == 0 {
        return None;
    }

    let mut block = vec![0u8; size as usize];

    let ok = unsafe {
        GetFileVersionInfoW(
            wide.as_ptr(),
            0,
            size,
            block.as_mut_ptr().cast::<std::ffi::c_void>(),
        )
    };

    if ok == 0 {
        return None;
    }

    Some(block)
}

#[cfg(windows)]
fn translation(block: &[u8]) -> Option<(u16, u16)> {
    let (pointer, bytes) = query(block, "\\VarFileInfo\\Translation")?;

    if bytes < 4 {
        return None;
    }

    let entry = unsafe { std::slice::from_raw_parts(pointer.cast::<u16>(), 2) };

    Some((*entry.first()?, *entry.get(1)?))
}

#[cfg(windows)]
fn string_value(block: &[u8], (language, codepage): (u16, u16), field: &str) -> Option<String> {
    let sub_block = format!("\\StringFileInfo\\{language:04x}{codepage:04x}\\{field}");
    let (pointer, length) = query(block, &sub_block)?;

    if length == 0 {
        return None;
    }

    let wide = unsafe { std::slice::from_raw_parts(pointer.cast::<u16>(), length as usize) };
    let value = String::from_utf16_lossy(wide);
    let value = value.trim_end_matches('\0').trim().to_owned();

    if value.is_empty() {
        None
    } else {
        Some(value)
    }
}

/// Returns a pointer into `block` plus the element count `VerQueryValueW`
/// reports, which is characters for string values and bytes for `Translation`.
#[cfg(windows)]
fn query(block: &[u8], sub_block: &str) -> Option<(*const std::ffi::c_void, u32)> {
    use windows_sys::Win32::Storage::FileSystem::VerQueryValueW;

    let wide = to_wide(std::ffi::OsStr::new(sub_block));
    let mut pointer: *mut std::ffi::c_void = std::ptr::null_mut();
    let mut length: u32 = 0;

    let ok = unsafe {
        VerQueryValueW(
            block.as_ptr().cast::<std::ffi::c_void>(),
            wide.as_ptr(),
            &mut pointer,
            &mut length,
        )
    };

    if ok == 0 || pointer.is_null() {
        return None;
    }

    Some((pointer.cast_const(), length))
}

#[cfg(windows)]
fn to_wide(value: &std::ffi::OsStr) -> Vec<u16> {
    use std::os::windows::ffi::OsStrExt;

    value.encode_wide().chain(std::iter::once(0)).collect()
}

#[cfg(test)]
mod tests {
    use super::display_name;

    #[test]
    fn display_name_should_return_none_for_a_missing_file() {
        let path = std::path::Path::new("/definitely/not/here/nothing.exe");

        assert_eq!(display_name(path), None);
    }
}
