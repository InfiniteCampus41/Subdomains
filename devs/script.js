const MAIN_REPO_OWNER = "infinitecampus41";
const MAIN_REPO_NAME = "InfiniteCampus";
let currentUser = null;
loadContributors();
function resetToContributors() {
    currentUser = null;
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("projectTitle").style.display = "none";
    document.getElementById("projectLine").style.display = "none";
    document.getElementById("repos").style.display = "none";
    document.getElementById("readme").style.display = "none";
    document.getElementById("backButton").style.display = "none";
    document.querySelector("h3.mt-4").style.display = "block";
    document.getElementById("contributors").style.display = "grid";
}
document.getElementById("backButton").onclick = resetToContributors;
async function loadUser(user) {
    currentUser = user;
    document.getElementById("contributors").style.display = "none";
    document.querySelector("h3.mt-4").style.display = "none";
    document.getElementById("profileSection").style.display = "block";
    document.getElementById("repos").style.display = "grid";
    document.getElementById("projectTitle").style.display = "block";
    document.getElementById("projectLine").style.display = "block";
    document.getElementById("readme").style.display = "block";
    document.getElementById("backButton").style.display = "inline-block";
    document.getElementById("repos").innerHTML = "Loading...";
    document.getElementById("readme").textContent = "Loading README...";
    const u = await fetch(`https://api.github.com/users/${user}`).then(r => r.json());
    document.getElementById("avatar").src = u.avatar_url;
    document.getElementById("username").textContent = u.login;
    document.getElementById("bio").textContent = u.bio || "No Bio Available";
    loadRepos(user);
    loadReadme(user);
}
async function loadRepos(user) {
    const reposContainer = document.getElementById("repos");
    reposContainer.innerHTML = "Loading";
    let url = "";
    if (user.toLowerCase() === "thehacker41") {
        url = `https://api.github.com/orgs/${MAIN_REPO_OWNER}/repos`;
    } else {
        url = `https://api.github.com/users/${user}/repos`;
    }
    const repos = await fetch(url).then(r => r.json());
    reposContainer.innerHTML = "";
    repos.forEach(repo => {
        const r = document.createElement("div");
        r.className = "repo";
        r.innerHTML = `
            <h4>${repo.name}</h4>
            <p>${repo.description || "No Description"}</p>
        `;
        r.onclick = () => window.open(repo.html_url, "_blank");
        reposContainer.appendChild(r);
    });
}
async function loadContributors() {
    const container = document.getElementById("contributors");
    container.innerHTML = "Loading Contributors...";
    const contributors = await fetch(
        `https://api.github.com/repos/${MAIN_REPO_OWNER}/${MAIN_REPO_NAME}/contributors`
    ).then(r => r.json());
    container.innerHTML = "";
    contributors.forEach(c => {
        const card = document.createElement("div");
        card.className = "contributor-card";
        card.innerHTML = `
            <img src="${c.avatar_url}" alt="${c.login}">
            <div class="contributor-username">${c.login}</div>
            <div class="contributor-commits">${c.contributions} commits</div>
        `;
        card.onclick = () => loadUser(c.login);
        container.appendChild(card);
    });
}

async function loadReadme(user) {
    const readmeBox = document.getElementById("readme");
    readmeBox.innerHTML = "Loading README...";
    const url = `https://raw.githubusercontent.com/${user}/${user}/main/README.md`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            readmeBox.textContent = "No README.md Found.";
            return;
        }
        let text = await res.text();
        text = text.replace(/<!--([\s\S]*?)-->/g, '$1');
        text = text.replace(/```html\s*([\s\S]*?)```/g, '$1');
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true,
            mangle: false,
            sanitizer: null,
            sanitize: false
        });
        readmeBox.innerHTML = marked.parse(text);
        readmeBox.querySelectorAll('style').forEach(el => {
            const newEl = document.createElement(el.tagName.toLowerCase());
            newEl.textContent = el.textContent;
            el.replaceWith(newEl);
        });
        readmeBox.classList.add("markdown-body");
    } catch (err) {
        readmeBox.textContent = "Failed To Load README.";
    }
}