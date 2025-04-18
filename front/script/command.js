const cmd = document.getElementById("command");
const prompt = document.getElementById("prompt");
let cmdFocus = false;

document.addEventListener("keydown", (e) => {
    if (!editor.isFocused()) {
        if (e.ctrlKey && e.key == "i") {
            if (readOnlyReadyState == true) {
                e.preventDefault();
                editor.focus();
                editor.setReadOnly(false);
                mode.textContent = "[INSERT]";
            }
        }
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
        if (editor.isFocused()) {
            if (readOnlyReadyState == true) {
                editor.blur();
                editor.setReadOnly(true);
                mode.textContent = "[NORMAL]";
            }
        }
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key == ":") {
        if (!editor.isFocused() || readOnlyReadyState == false) {
            e.preventDefault();
            prompt.textContent = ":";
            cmdFocus = true;
            cmd.focus();
            cmd.value = "";
            mode.textContent = "[COMMAND]";
        }
    }
});

function toggleLineNumber() {
    if (showGutter.checked == true) {
        editor.renderer.setShowGutter(false);
        showGutter.checked = false;
    } else {
        editor.renderer.setShowGutter(true);
        showGutter.checked = true;
    }
}

function toggleWhiteSpace() {
    if (showInvisible.checked == true) {
        editor.setOption("showInvisibles", false);
        showInvisible.checked = false;
    } else {
        editor.setOption("showInvisibles", true);
        showInvisible.checked = true;
    }
}

function togglewordwrap() {
    if (toggleWordWrap.checked == true) {
        editor.session.setUseWrapMode(false);
        toggleWordWrap.checked = false;
    } else {
        editor.session.setUseWrapMode(true);
        toggleWordWrap.checked = true;
    }
}

function handleTerm(val) {
    let value = val.split(" ");
    switch (value[0]) {
        case "tog":
            switch (value[1]) {
                case "l":
                    toggleLineNumber();
                    prompt.textContent = `LineNumber: ${showGutter.checked}`;
                    cmd.value = "";
                    break;
                case "ws":
                    toggleWhiteSpace();
                    prompt.textContent = `WhiteSpace: ${showGutter.checked}`;
                    cmd.value = "";
                    break;
                case "ww":
                    togglewordwrap();
                    prompt.textContent = `WordWrap: ${showGutter.checked}`;
                    cmd.value = "";
                    break;
                default:
                    prompt.textContent = `Unknown property for '${value[0]}': ${value[1]}`;
                    cmd.value = "";
                    break;
            }
            break;
        case "cl":
            switch (value[1]) {
                case "showall":
                    editor.setValue("[COLOR LIST]");
                    for (let i = 0; i <= themeList.length - 1; i++) {
                        editor.session.insert(1, themeList[i]);
                    }
                    editor.focus();
                    break;
                case "set":
                    if (themeList.includes(value[2])) {
                        editor.setTheme(`ace/theme/${value[2]}`);
                        editor.focus();
                        if (readOnlyReadyState == true) {
                            editor.setReadOnly(false);
                        }
                    } else {
                        prompt.textContent = `Unknown theme: ${value[2]}`;
                        cmd.value = "";
                        editor.focus();
                        if (readOnlyReadyState == true) {
                            editor.setReadOnly(false);
                        }
                    }
                    break;
            }
            break;
        case "term":
            openTerm();
            break;
        default:
            prompt.textContent = `Unknown command: ${value[0]}`;
            cmd.value = "";
            break;
    }
}

cmd.addEventListener("keydown", (e) => {
    if (cmdFocus) {
        if (e.key == "Enter") {
            handleTerm(cmd.value);
            cmd.blur();
            if (readOnlyReadyState == false) {
                mode.textContent = "[STANDBY]";
            } else {
                mode.textContent = "[NORMAL]";
            }
        }
        if (e.key == "Escape") {
            cmd.blur();
            cmd.value = "";
            prompt.textContent = "";
            if (readOnlyReadyState == false) {
                mode.textContent = "[STANDBY]";
            } else {
                mode.textContent = "[NORMAL]";
            }
        }
    }
});
