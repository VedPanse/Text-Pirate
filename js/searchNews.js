function news(text, title, comments) {
    text = text + " " + title + " " + comments;
    let googleLink = "https://www.google.com/search?q=" + encodeURIComponent(text.replace(/ /g, "+"));


    // Use chrome.runtime.sendMessage to send a message to a background script
    chrome.runtime.sendMessage({action: 'fetchGoogleData', link: googleLink}, (response) => {
        if (response && response.data) {
            const webData = document.createElement("div");
            webData.innerHTML = response.data;
            const h3List = "h3.LC20lb.MBeuO.DKV0Md";

            let aArray = [];
            let h3Array = [];

            webData.querySelectorAll(h3List).forEach((item) => {
                h3Array.push(item.innerHTML);
                aArray.push(item.parentElement.href);
            });

            for (let i = 0; i < Math.min(Math.min(h3Array.length, aArray.length), 8); i++) {
                createDiv(aArray[i], h3Array[i], i);
            }
        } else {
            console.error('Failed to fetch data from Google.');
        }
    });
}

function createDiv(link, text, iteration) {

    const iteration_scaling = {
        // iteration_number = [top %, left %]
        0: [5, 5],
        1: [5, 42],
        2: [5, 85],
        3: [40, 5],
        4: [40, 85],
        5: [75, 5],
        6: [75, 42],
        7: [75, 85]
    }


    let newElement = document.createElement("div");
    newElement.style.cursor = "pointer";
    newElement.addEventListener("click", () => {
        window.open(link, "_blank");
    });

    // Use a promise to handle the asynchronous chrome.runtime.sendMessage
    new Promise((resolve) => {
        chrome.runtime.sendMessage({action: 'fetchGoogleData', link: link}, (response) => {
            if (response && response.data) {
                const webData = document.createElement("div");
                webData.innerHTML = response.data;

                let faviconLink = getFaviconLink(webData, link);
                resolve(faviconLink); // Resolve the promise with the favicon link
            } else {
                console.error('Failed to fetch data from Google.');
                resolve(""); // Resolve the promise with an empty string if there's an error
            }
        });
    }).then((faviconLink) => {
        if (faviconLink.trim() !== "") {
            const image = document.createElement("img");
            image.setAttribute("src", faviconLink);
            image.style.width = "20px";
            image.style.height = "20px";
            newElement.appendChild(image);
        }

        newElement.style.backdropFilter = "blur(20px)";
        newElement.style.backgroundColor = "rgb(0, 0, 0, 0.5)";
        // Add overlay of transparent black shade
        newElement.style.position = "relative";
        newElement.style.zIndex = 100_000;
        newElement.style.color = "white";

        let paragraph = document.createElement("p");
        paragraph.innerHTML = text;
        paragraph.style.color = "white";
        paragraph.style.position = "relative";
        paragraph.style.zIndex = 200_000;
        paragraph.style.fontSize = "12px";

        newElement.appendChild(paragraph);

        newElement.style.position = "fixed";
        newElement.style.top = iteration_scaling[iteration][0] + "%";
        newElement.style.left = iteration_scaling[iteration][1] + "%";
        newElement.style.padding = "20px";
        newElement.style.border = "1px solid rgb(255, 255, 255, 0.1)";
        newElement.style.borderRadius = "20px";
        newElement.style.width = "200px";
        newElement.style.height = "100px";
        newElement.style.maxHeight = "200px";
        newElement.style.overflowY = "scroll";
        newElement.classList.add("news-bits")

        document.body.appendChild(newElement);
    });
}

function getFaviconLink(webData, link) {
    // Extract favicon link from the webpage

    let faviconLink = "";

    try {
        webData.querySelectorAll("link").forEach((item) => {
            const linkHref = item.href && item.href.toString(); // Check if href exists before calling toString()
            const imageExtensions = [".png", ".svg", ".jpg", ".jpeg", ".gif", ".bmp", ".ico"]; // Add more image extensions if needed

            if (linkHref && imageExtensions.some(ext => linkHref.includes(ext))) {
                if (item.getAttribute("rel").toString() === "icon") {
                    if (linkHref.charAt(0) === "/") {
                        faviconLink = link + linkHref;
                    } else {
                        faviconLink = linkHref;
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error processing favicon link:", error);
    }

    if (faviconLink.trim() === "") {
        try {
            const faviconElement = webData.querySelector("link[rel='icon']") || webData.querySelector("link[rel='shortcut icon']");
            faviconLink = faviconElement ? faviconElement.href : "";
        } catch (error) {
            console.error("Error retrieving favicon element:", error);
        }
    }

    return faviconLink;
}



