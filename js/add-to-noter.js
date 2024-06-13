function getInput() {
    // Create a div for the form
    let form = document.createElement("div");
    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.zIndex = 100_000;
    form.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    form.style.color = "black";
    form.style.borderRadius = "20px";
    form.style.padding = '20px';
    form.style.backdropFilter = "blur(20px)";
    form.style.width = "50vw";

    let title = document.createElement("input");
    title.setAttribute("placeholder", "Enter title for this bookmark");

    let comments = document.createElement("input");
    comments.setAttribute("placeholder", "Enter comments (Optional)");

    const selectedText = window.getSelection().toString();
    const rangeObject = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const rangePosition = Math.round(rangeObject.top);

    let closeBtn = document.createElement("p");
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.innerHTML = '×';
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => {
        form.style.display = "none";
    }

    const allInputs = [title, comments];

    allInputs.forEach((item) => {
        item.style.width = "100%";
        item.style.display = "block";
        item.style.backgroundColor = "transparent";
        item.style.border = "none";
        item.style.marginBottom = "5px";
        item.style.borderBottom = "1px solid rgb(0, 0, 0, 0.1)";
        item.style.fontFamily = "'IBM Plex Sans', sans-serif"

        item.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const titleValue = title.value.trim() === "" ? "Untitled" : title.value;
                const commentsValue = comments.value.trim() === "" ? "No comments" : comments.value;

                askForInput(titleValue, commentsValue, selectedText, rangePosition);
                form.style.display = "none";
            }
        })
    });

    comments.style.marginBottom = "25px";

    let button = document.createElement("button");
    button.style.backgroundColor = "transparent";
    button.style.border = "1px solid rgb(0, 0, 0, 0.1)";
    button.innerHTML = "Submit";
    button.style.cursor = "pointer";
    button.style.fontFamily = "'IBM Plex Sans', sans-serif"

    button.addEventListener("click", () => {
        const titleValue = title.value.trim() === "" ? "Untitled" : title.value;
        const commentsValue = comments.value.trim() === "" ? "No comments" : comments.value;

        askForInput(titleValue, commentsValue, selectedText, rangePosition);
        form.style.display = "none";
    });

    // Append the text to the form
    form.appendChild(title);
    form.appendChild(comments);
    form.appendChild(button);
    form.appendChild(closeBtn);

    // Append the form to the body
    document.body.appendChild(form);
}


function askForInput(title, comments, selectedText, rangePosition) {
    if (title || comments) {
        chrome.storage.sync.get(['noterData'], (result) => {
            const existingData = result.noterData;
            const newData = Array.isArray(existingData) ? existingData : [];
            const url = document.URL;

            const newItem = {
                title: title || "Untitled",
                text: selectedText,
                link: url,
                comments: comments,
                position: rangePosition
            };

            newData.push(newItem);

            chrome.storage.sync.set({'noterData': newData}, () => {
                console.log('Data saved to Chrome storage!');
                recallStorage(); // Call recallStorage inside the callback
                // clearChromeStorage();
            });
        });
    }
}

function clearChromeStorage() {
    chrome.storage.sync.clear(() => {
        console.log('Chrome storage cleared!');
    });
}

function recallStorage() {
    chrome.storage.sync.get(['noterData'], (result) => {
        const data = result.noterData;
        console.log("Storage Data:");
        console.log(data);
        // Call displayData and pass the data to it
        // displayData(data => {
        //     // Process the data here
        //     console.log("Data received from displayData:");
        //     console.log(data);
        // });
    });
}


getInput();