const BIN_ID = "67c08ce3acd3cb34a8f211ab";
const API_KEY = "$2a$10$S/ermR9MB35mfmtJdA3EJ.PMk3FBnvC9PyCbfB30iBTSfsMy6p2Jq";
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const correctPassword = "123456";
let currentElement = null;
let currentSection = null;
let cvData = null;

document.addEventListener("DOMContentLoaded", () => {
    loadCVData();
});

function loadCVData() {
    fetch(BASE_URL, {
        headers: { "X-Master-Key": API_KEY }
    })
    .then(response => response.json())
    .then(data => {
        cvData = data.record;
        // Chuyển rating từ 0-100 sang 1-10 nếu dữ liệu cũ
        cvData.it_skills.forEach(item => item.rating = Math.round(item.rating / 10) || 1);
        cvData.languages.forEach(item => item.rating = Math.round(item.rating / 10) || 1);
        renderCV(cvData);
    })
    .catch(error => console.error("Error loading CV data:", error));
}

function renderCV(data) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const infoColumn = document.getElementById("info-column");
    const contentColumn = document.getElementById("content-column");

    infoColumn.innerHTML = `
        <img class="avt" src="${data.personal.avatar}">
        <p class="name${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ' onclick="showEdit(this, \'personal.name\')"' : ''}>${data.personal.name}</p>
        <p class="job${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ' onclick="showEdit(this, \'personal.job\')"' : ''}>${data.personal.job}</p>
        ${renderSection("Thông tin cơ bản", "info_title", data.basic_info, "basic_info")}
        ${renderSection("Học vấn", "info_title2", data.education.items, "education", data.education.title)}
        ${renderSection("Kinh nghiệm làm việc", "info_title3", data.experience.items, "experience", data.experience.title, data.experience.description)}
        ${renderContact(data.contact)}
    `;

    contentColumn.innerHTML = `
        <p class="message${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ' onclick="showEdit(this, \'message\')"' : ''}>"${data.message}"</p>
        ${renderListSection("Kỹ năng", "info_title4", data.skills, "skills")}
        ${renderRatedListSection("Tin học", "info_title4", data.it_skills, "it_skills")}
        ${renderRatedListSection("Ngoại ngữ", "info_title5", data.languages, "languages")}
        ${renderListSection("Giải thưởng", "info_title6", data.awards, "awards")}
        ${renderListSection("Chứng chỉ", "info_title5", data.certificates, "certificates")}
        ${renderListSection("Hoạt động", "info_title5", data.activities, "activities")}
        ${renderHobbies(data.hobbies)}
    `;
}

function renderSection(title, titleClass, items, sectionKey, sectionTitle = "", description = []) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let html = `
        <div class="basic_info">
            <p class="${titleClass}">${title}${isLoggedIn ? ` <button class="add-btn" onclick="showAddFieldPopup('${sectionKey}')">+</button>` : ''}</p>
    `;
    if (sectionTitle) html += `<p class="title${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ` onclick="showEdit(this, '${sectionKey}.title')"` : ''}>${sectionTitle}</p>`;
    html += items.map((item, index) => `
        <div class="info-item">
            <div class="icon-circle"><i class="${item.icon}"></i></div>
            <span>${item.label}: <span class="bold_text text_primary${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ` onclick="showEdit(this, '${sectionKey}[${index}].value')"` : ''}>${item.value}</span></span>
        </div>
    `).join("");
    if (description.length > 0) {
        html += `
            <div class="description">
                <ul>
                    ${description.map((desc, index) => `<li><p class="text_primary${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ` onclick="showEdit(this, '${sectionKey}.description[${index}]')"` : ''}>${desc}</p></li>`).join("")}
                </ul>
            </div>
        `;
    }
    html += `</div>`;
    return html;
}

function renderContact(contact) {
    return `
        <div class="basic_info">
            <p class="info_title2">Liên hệ</p>
            <div class="contact-icons">
                <div class="hexagon-frame">
                    ${contact.links.map(link => `<a href="${link.url}" target="_blank"><i class="${link.icon}"></i></a>`).join("")}
                </div>
            </div>
        </div>
    `;
}

function renderListSection(title, titleClass, items, sectionKey) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    return `
        <div class="basic_info">
            <p class="${titleClass}">${title}${isLoggedIn ? ` <button class="add-btn" onclick="showAddFieldPopup('${sectionKey}')">+</button>` : ''}</p>
            <div class="skill">
                <ul>
                    ${items.map((item, index) => `<li><p class="text_primary${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ` onclick="showEdit(this, '${sectionKey}[${index}]')"` : ''}>${item}</p></li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}

function renderRatedListSection(title, titleClass, items, sectionKey) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    return `
        <div class="basic_info">
            <p class="${titleClass}">${title}${isLoggedIn ? ` <button class="add-btn" onclick="showAddFieldPopup('${sectionKey}')">+</button>` : ''}</p>
            <div class="skill-tin">
                <ul>
                    ${items.map((item, index) => `
                        <li>
                            <p class="text_primary${isLoggedIn ? ' editable' : ''}"${isLoggedIn ? ` onclick="showEdit(this, '${sectionKey}[${index}].name', '${sectionKey}[${index}].rating')"` : ''}>${item.name}</p>
                            <span class="rating-value">${item.rating}/10</span>
                        </li>
                    `).join("")}
                </ul>
            </div>
        </div>
    `;
}

function renderHobbies(hobbies) {
    return `
        <div class="basic_info">
            <p class="info_title5">Sở thích</p>
            <div class="contact-icons">
                <div class="hexagon-frame">
                    ${hobbies.map(hobby => `
                        <div class="icon-container">
                            <a><i class="${hobby.icon}"></i></a>
                            <div class="icon-caption">${hobby.label}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

function showLoginPopup() {
    document.getElementById("loginPopup").style.display = "block";
    document.getElementById("passwordInput").value = "";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}

function checkPassword() {
    const password = document.getElementById("passwordInput").value;
    if (password === correctPassword) {
        localStorage.setItem("isLoggedIn", "true");
        closePopup("loginPopup");
        renderCV(cvData);
    } else {
        alert("Mật khẩu sai!");
    }
}

function showEdit(element, path, ratingPath = null) {
    if (localStorage.getItem("isLoggedIn") !== "true") return;
    currentElement = { element, path, ratingPath };
    document.getElementById("editPopup").style.display = "block";
    document.getElementById("editInput").value = element.innerText;

    const editRating = document.getElementById("editRating");
    if (ratingPath) {
        const ratingValue = getValueFromPath(ratingPath);
        editRating.style.display = "block";
        editRating.value = ratingValue;
    } else {
        editRating.style.display = "none";
    }
}

function saveEdit() {
    const newValue = document.getElementById("editInput").value;
    const newRating = document.getElementById("editRating").value;

    if (newValue !== null && currentElement) {
        currentElement.element.innerText = newValue;
        updateCVData(currentElement.path, newValue);

        if (currentElement.ratingPath) {
            const rating = Math.min(Math.max(parseInt(newRating) || 1, 1), 10); // Giới hạn 1-10
            updateCVData(currentElement.ratingPath, rating);
            currentElement.element.nextElementSibling.innerText = `${rating}/10`; // Cập nhật số trực tiếp
        }

        saveToJSONBin();
    }
    closePopup("editPopup");
}

function getValueFromPath(path) {
    const parts = path.split(/[\[\].]+/);
    let current = cvData;
    for (let part of parts) {
        if (part) current = current[part];
    }
    return current;
}

function showAddFieldPopup(sectionKey) {
    if (localStorage.getItem("isLoggedIn") !== "true") return;
    currentSection = sectionKey;
    document.getElementById("addFieldPopup").style.display = "block";
    document.getElementById("newFieldLabel").value = "";
    document.getElementById("newFieldValue").value = "";
    document.getElementById("newFieldIcon").value = "";
}

function addNewField() {
    const label = document.getElementById("newFieldLabel").value;
    const value = document.getElementById("newFieldValue").value;
    const icon = document.getElementById("newFieldIcon").value;

    if (!label || !value || (!icon && (currentSection.includes("basic_info") || currentSection.includes("education") || currentSection.includes("experience")))) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    if (currentSection.includes("basic_info") || currentSection.includes("education") || currentSection.includes("experience")) {
        const newItem = { icon, label, value };
        if (currentSection.includes("basic_info")) cvData.basic_info.push(newItem);
        else if (currentSection.includes("education")) cvData.education.items.push(newItem);
        else if (currentSection.includes("experience")) cvData.experience.items.push(newItem);
    } else if (currentSection === "skills") {
        cvData.skills.push(value);
    } else if (currentSection === "it_skills" || currentSection === "languages") {
        cvData[currentSection].push({ name: value, rating: 5 }); // Giá trị mặc định là 5/10
    } else {
        cvData[currentSection].push(value);
    }

    saveToJSONBin();
    renderCV(cvData);
    closePopup("addFieldPopup");
}

function updateCVData(path, value) {
    const parts = path.split(/[\[\].]+/);
    let current = cvData;
    for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i]) current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

function saveToJSONBin() {
    fetch(BASE_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY
        },
        body: JSON.stringify(cvData)
    })
    .then(response => response.json())
    .then(data => console.log("Saved to JSONBin:", data))
    .catch(error => console.error("Error saving to JSONBin:", error));
}

window.onclick = function(event) {
    const loginPopup = document.getElementById("loginPopup");
    const editPopup = document.getElementById("editPopup");
    const addPopup = document.getElementById("addFieldPopup");
    if (event.target == loginPopup) closePopup("loginPopup");
    if (event.target == editPopup) closePopup("editPopup");
    if (event.target == addPopup) closePopup("addFieldPopup");
};

document.getElementById("passwordInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkPassword();
});

document.getElementById("editInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") saveEdit();
});