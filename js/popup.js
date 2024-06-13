function displayData() {
    chrome.storage.sync.get(['noterData'], (result) => {
        const data = result.noterData;
        const rowElement = document.querySelector("#row");

        rowElement.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            let item = data[i];

            let title = document.createElement("p");
            title.contentEditable = "true";
            title.innerHTML = item.title;
            title.classList.add("title-section")
            title.addEventListener('input', (event) => {
                data[i].title = event.target.innerHTML;
                syncData(data);
            });

            let link = document.createElement("h6");
            link.innerHTML = item.link.split("//")[1].split("/")[0];
            link.classList.add("link-section");
            link.addEventListener("click", () => {
                chrome.runtime.sendMessage({action: "highlightText", data: item.text});
                window.open(item.link, "_blank");
            });

            link.addEventListener("mouseover", () => {
                link.style.color = "rgb(127, 82, 255)";
            });

            link.addEventListener("mouseout", () => {
                link.style.color = "black";
            });

            let text = document.createElement('p');
            // text.contentEditable = 'true';
            text.innerHTML = item.text;
            text.classList.add("text-section");
            // text.addEventListener('input', (event) => {
            //     data[i].text = event.target.innerHTML;
            //     syncData(data);
            // });

            let comments = document.createElement('p');
            comments.contentEditable = true;
            comments.classList.add("comments-section")
            comments.innerHTML = item.comments;
            comments.addEventListener('input', (event) => {
                data[i].comments = event.target.innerHTML;
                syncData(data)
            })

            // let tag_list = item.tags.toLowerCase().split(" ");

            // let tags_holder = document.createElement("div");

            // for (let iterator = 0; iterator < tag_list.length; iterator++) {
            //     let tag_span = document.createElement("span");
            //     tag_span.contentEditable = 'true';
            //     tag_span.innerHTML = tag_list[iterator] + " ";
            //     tag_span.classList.add("tag-span");
            //     tag_span.classList.add("span-" + iterator);
            //     tags_holder.appendChild(tag_span);
            // }

            let deleteMe = document.createElement("img");
            deleteMe.src = "../icons/trash.svg";
            deleteMe.style.width = "10px";
            deleteMe.style.position = "absolute";
            deleteMe.style.top = "2%";
            deleteMe.style.right = "2%";

            let grip = document.createElement("img");
            grip.src = "../icons/grip.svg";
            grip.style.width = "10px";
            grip.style.position = "absolute";
            grip.style.top = "2%";
            grip.style.right = "10%";
            grip.style.cursor = "pointer";
            grip.style.zIndex = 0;

            let gripGuard = document.createElement("div");
            gripGuard.style.width = "10px";
            gripGuard.style.height = "20px";
            gripGuard.style.position = "absolute";
            gripGuard.style.top = "2%";
            gripGuard.style.right = "10%";
            gripGuard.style.cursor = "pointer";
            gripGuard.style.zIndex = 1;

            deleteMe.style.cursor = "pointer";
            deleteMe.addEventListener('click', () => {
                data.splice(i, 1);
                syncData(data);
                displayData();
            });

            let bigDiv = document.createElement('div');
            bigDiv.classList.add("col-lg-6");
            bigDiv.classList.add("col-md-6");
            bigDiv.classList.add("col-sm-6");

            let card = document.createElement('div');
            card.classList.add('card');
            card.style.border = "1px solid transparent";
            card.style.backgroundColor = "transparent";

            card.appendChild(title);
            card.appendChild(link);
            card.appendChild(text);
            card.appendChild(comments);
            // card.appendChild(tag_holder);
            card.appendChild(deleteMe);
            card.appendChild(grip);
            card.appendChild(gripGuard);
            card.setAttribute("draggable", true);

            bigDiv.addEventListener("mouseover", () => {
                bigDiv.style.backgroundColor = "#f0f0f0";
            });

            bigDiv.addEventListener("mouseout", () => {
                bigDiv.style.backgroundColor = "transparent";
            });

            card.addEventListener("dragstart", () => {
                setTimeout(() => sendMessageToBackground(item), 1000);
            });

            bigDiv.appendChild(card);
            rowElement.appendChild(bigDiv);
        }
    });
}

function syncData(data) {
    chrome.storage.sync.set({'noterData': data}, () => {
        console.log('Data synced to Chrome storage!');
    });
}

// SEARCH ALGORITHM LIVES HERE

function filterCards(searchQuery) {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        const thisTitle = card.querySelector('.title-section').innerHTML;
        const thisComments = card.querySelector('.comments-section').innerHTML;
        const thisLink = card.querySelector('.link-section').innerHTML;
        const thisText = card.querySelector('.text-section').innerHTML;

        const match = thisTitle.toLowerCase().includes(searchQuery) || thisComments.toLowerCase().includes(searchQuery) ||
            thisText.toLowerCase().includes(searchQuery) || thisLink.toLowerCase().includes(searchQuery);

        if (searchQuery === "") {
            card.style.display = "block";
        } else if (!match) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    displayData();

    const searchInput = document.getElementById('search');

    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim().toLowerCase();
        filterCards(searchQuery);
    });
});

function sendMessageToBackground(card) {
    chrome.runtime.sendMessage({action: 'openCard', data: card});
}

function allowDrop(ev) {
    ev.preventDefault();
}

document.querySelector("a#developer-link").addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action: "openDeveloper"
    })
});

document.querySelector("a#about-link").addEventListener("click", () => {
    document.querySelector("#row").style.display = "none";
    document.querySelector("#about").style.display = "block";
});

document.querySelector("a#tp").addEventListener("click", () => {
    document.querySelector("#about").style.display = "none";
    document.querySelector("#row").style.display = "block";
    window.location.reload();
});