chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayCard" && request.data) {
        const card = request.data;
        const fontFamily = "Helvetica";

        const displayCard = document.createElement("div");
        displayCard.id = "popUpCard";
        displayCard.style.position = "fixed";
        displayCard.style.zIndex = 1000000;
        displayCard.style.top = "25%";
        displayCard.style.left = "25%";
        displayCard.style.backdropFilter = "blur(20px)";
        displayCard.style.width = "50vw";
        displayCard.style.border = "1px solid rgba(0, 0, 0, 0.1)";
        displayCard.style.borderRadius = "20px";
        displayCard.style.padding = '20px';
        displayCard.style.maxHeight = "250px";
        displayCard.style.overflowY = "scroll";

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "×";
        closeBtn.style.backgroundColor = "transparent";
        closeBtn.style.border = "1px solid transparent";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.position = "absolute";
        closeBtn.style.color = "black";
        closeBtn.style.top = "10px";
        closeBtn.style.right = "10px";

        closeBtn.onclick = () => {
            displayCard.style.display = "none";
            document.querySelectorAll("div.news-bits").forEach((item) => {
                item.style.display = "none";
            })
        };
        displayCard.appendChild(closeBtn);

        const titlePlate = document.createElement("p");
        titlePlate.innerHTML = card.title;
        titlePlate.style.fontSize = "16px";
        titlePlate.style.color = 'black';

        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        // link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap');

        titlePlate.style.fontFamily = "'IBM Plex Sans', sans-serif"

        const linkPlate = document.createElement("h6");
        linkPlate.innerHTML = card.link.split("https://")[1].split("/")[0];
        linkPlate.style.cursor = "pointer";
        linkPlate.style.paddingBottom = "2px";
        linkPlate.style.borderBottom = "1px solid black";
        linkPlate.style.display = "inline";
        linkPlate.style.textTransform = "lowercase";
        linkPlate.style.fontFamily = fontFamily;
        linkPlate.style.fontFamily = "'IBM Plex Sans', sans-serif"
        linkPlate.style.fontSize = "16px";
        linkPlate.style.color = "rgb(127, 82, 255)";


        linkPlate.addEventListener("click", () => {
            // Send a message to the background script to execute the search function
            window.open(card.link, "_blank");

            chrome.runtime.sendMessage({
                action: 'executeSearch',
                text: card.text,
                link: card.link,
            });
        });


        // linkPlate.onclick = () => {
        //   window.open(card.link, "target");
        // };

        const textPlate = document.createElement("p");
        textPlate.innerHTML = card.text;
        textPlate.style.color = 'black';
        textPlate.style.fontFamily = "'IBM Plex Sans', sans-serif"

        const commentPlate = document.createElement("p");
        commentPlate.innerHTML = card.comments;
        commentPlate.classList.add("comments-sections")
        commentPlate.style.color = "#333";
        commentPlate.style.borderTop = "1px solid rgb(0, 0, 0, 0.1)";
        commentPlate.style.fontFamily = "'IBM Plex Sans', sans-serif"


        // const tagName = document.createElement("span");
        // tagName.style.color = "rgb(127, 82, 255)";
        // tagName.innerHTML = "Tags:-";

        // const tagPlate = document.createElement("p");
        // tagPlate.innerHTML = card.tags;

        displayCard.appendChild(titlePlate);
        displayCard.appendChild(linkPlate);
        displayCard.appendChild(textPlate);
        displayCard.appendChild(commentPlate);
        // displayCard.appendChild(tagName);
        // displayCard.appendChild(tagPlate);
        displayCard.style.backgroundColor = "rgb(255, 255, 255, 0.75)";
        displayCard.style.color = "black";
        displayCard.style.fontFamily = fontFamily;
        displayCard.style.fontSize = "16px";
        displayCard.style.lineHeight = 2;
        document.body.appendChild(displayCard);
    } else if (request.action === "contentOpenDeveloper") {
        window.open("https://vedpanse.com", "_blank");
    }
});