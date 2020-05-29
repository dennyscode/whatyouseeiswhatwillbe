export function selectorjs(root) {
    console.log("Testing SelectorJS");
    console.log(root);
    starter(root);
}

export let selectorjs__customs = {
    "selected_start": null,
    "selected_end": null,
    "selected_text": null,
    "root": null,
    "getSelectionToggle": null,
}

function starter(root) {
    console.log("From Starter");
    selectorjs__customs.root = root;
    addEditButton(root);
    addTextView(root);
    toolBoxActivation(root);
    getSelectionToggle(root);

}

function useRoot(root) {
    console.log(root);
    if (root.nodeType == 1) {
        return root
    } else {
        return selectorjs_data.root;
    }
}

function addEditButton(root) {
    const editButton = document.createElement("button");
    editButton.setAttribute("class", "selector__selectorButton js-selector__edit")
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        let dialogContainer = document.querySelector(".selector");
        dialogContainer.show();
        dialogContainer.style.display='block';
    });
    editButton.setAttribute("onclick", "function() {document.querySelector('.selector').style.display='show'}");
    root.appendChild(editButton);
}

function addTextView(root) {
    const textInput = document.createElement("div");
    textInput.setAttribute("class", "selector__textPreview");
    // the addEditButton method creates a button and shows up as string in root.innerText
    // following line fixes this issue: 
    let editButtonTextLength = root.querySelector(".js-selector__edit").textContent.length
    textInput.innerText = root.innerText.slice(0, -editButtonTextLength);
    const dialogContainer = root.querySelector(".selector");
    dialogContainer.insertBefore(textInput,dialogContainer.children[2]);
}

function getFullText(root) {
    let fullText = "";
    getSelection().focusNode.parentNode.childNodes.forEach(element => { 
        fullText += element.textContent;
    })
    return fullText
}

function loopTextNodesUntilMatch(root) {
    let selectionContainer = root.querySelector(".selector .selector__textPreview");
    let count = 0; 
    let maxTextNodes = getSelection().focusNode.parentNode.childNodes.length;
    getSelection().focusNode.parentNode.childNodes.forEach(element => { 
        if ((element===getSelection()) == false) { 
            count += element.textContent.length;
        } 
        else if (element===getSelection().focusNode) {
            count += getSelection().anchorOffset;
        }
        console.log("Count: " + count)
    })
}

function getSelectionOnChange(root) {
    let selectionContainer = root.querySelector(".selector .selector__textPreview");
    document.addEventListener('selectionchange', function() {
        if (selectorjs__customs.getSelectionToggle == true) {
            let selector_active = document.getSelection();

            // Get the start index of a selected text
            let getMarkedStart;
            if (selector_active.anchorOffset <= selector_active.focusOffset) {
                getMarkedStart = selector_active.anchorOffset;
            } else {
                getMarkedStart = selector_active.focusOffset;
            }
            selectionContainer.parentElement.querySelector(".js-selector__getMarkedStart").value = getMarkedStart;
            console.log("Selector Active");
            console.log(selector_active.focusNode);
            window.selectorjs_data.selected_start = getMarkedStart;

            // Get the end index of a selected text
            let getMarkedEnd;
            if (selector_active.focusOffset >= selector_active.anchorOffset) {
                getMarkedEnd = selector_active.focusOffset;
            } else {
                getMarkedEnd = selector_active.anchorOffset;
            }
            selectionContainer.parentElement.querySelector(".js-selector__getMarkedEnd").value = getMarkedEnd;
            window.selectorjs_data.selected_end = getMarkedEnd;


            // Get the length of a selected text
            let getMarkedLength;
            if ( (selector_active.focusOffset - selector_active.anchorOffset) >= 0) {
                getMarkedLength = selector_active.focusOffset - selector_active.anchorOffset;
            } else {
                getMarkedLength = selector_active.anchorOffset - selector_active.focusOffset;
            }
            selectionContainer.parentElement.querySelector(".js-selector__getMarkedLength").value = getMarkedLength;
            let getMarkedText = selector_active.focusNode.parentElement.textContent.substring(getMarkedStart,getMarkedEnd); 
            root.querySelector(".selector__editView").textContent = getMarkedText;
            window.selectorjs_data.selected_text = getMarkedText;
        }
    });
}

function getSelectionToggle(root) {
    let selectionContainer = root.querySelector(".selector .selector__textPreview")
    selectionContainer.addEventListener("mousedown", function(root) {
        window.selectorjs_data.getSelectionToggle = true;
        root = useRoot(root);
        getSelectionOnChange(root);
        console.log("MouseDown");
    })

    selectionContainer.addEventListener("mouseup", function() {
        window.selectorjs_data.getSelectionToggle = false;
        getSelectionOnChange(root);
        console.log("MouseUp");
    })
}

function errorMessage(root, errorMethod, errorName) {
    let errorSolution;
    let errorMessageNode = document.createElement("div");
    errorMessageNode.setAttribute("class", "selector__errorMessage");
    if (errorName == "noSelection") {
        console.log("NoSelection!");
        errorSolution = "select text";
        errorMessageNode.textContent = "In order to use " + errorMethod + " you need to " + errorSolution;
    }
    errorMessageNode.addEventListener("click", function() {
        removeNode(this);
    })
    root.querySelector(".selector").appendChild(errorMessageNode);
}

function getEditedText(type) {
    let textEditTag = {
        "editedTag": null,
        "editedOpeningTag": null,
        "editedClosingTag": null
    }

    if (type == "bold") {
        textEditTag.editedTag = "strong";

    }

    return `<${textEditTag.editedOpeningTag}>${textEditTag.editedTag}</${textEditTag.editedClosingTag}>`

}

function editSelected(root, type) {
    console.log("editSelected-Function:")
    let preText,
        afterText,
        editedOpeningTag, 
        editedClosingTag,
        editededitedText,
        fullText = getFullText(root);

    if (type == "bold") {
        editedOpeningTag = "<strong>";
        editedClosingTag = "</strong>";
    }
    if (window.selectorjs_data.selected_start != null && window.selectorjs_data.selected_start != "") {
        preText = root.querySelector(".selector__textPreview").textContent.slice(0, parseInt(selectorjs_data.selected_start));
        editededitedText = editedOpeningTag + window.selectorjs_data.selected_text + editedClosingTag;
        afterText = root.querySelector(".selector__textPreview").textContent.slice(parseInt(window.selectorjs_data.selected_end));
        console.log("preText:" + preText);
        console.log("editededitedText:" + editededitedText);
        console.log("afterText:" + afterText);
        let output = preText + editededitedText + afterText;
        console.log("Full Text: " + fullText);
        loopTextNodesUntilMatch(root);
        root.querySelector(".selector__textPreview").innerHTML = output;
    } else {
        console.log("noSelection!");
        errorMessage(root, type, "noSelection");
    }
}

function removeNode(el) {
    var element = el;
    element.remove();
}

function toolBoxActivation(root) {
    root.querySelectorAll(".selector__selectorButton[selector__tool]").forEach(element => { 
        element.addEventListener("click", function() { 
            console.log(element.getAttribute("selector__tool"));
            root = useRoot(root);
            editSelected(root, element.getAttribute("selector__tool"))
        });
    })
}