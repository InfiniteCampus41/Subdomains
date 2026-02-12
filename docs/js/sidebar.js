function normalizePath(path){
    if(!path) return "/";
    path = path.replace(/\/$/, "");
    if(path === "") path = "/";
    path = path.replace(/\.html$/i, "");
    if(path.toLowerCase() === "/index") path = "/";
    return path.toLowerCase();
}
async function loadSidebar(){
    const res = await fetch("/partials/sidebar.html");
    const html = await res.text();
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = html;
    sidebar.querySelectorAll(".dropbtn").forEach(btn=>{
        btn.onclick = () => btn.parentElement.classList.toggle("open");
    });
    const currentPath = normalizePath(location.pathname);
    sidebar.querySelectorAll("a[data-path]").forEach(a=>{
        const linkPath = normalizePath(a.dataset.path);
        if(linkPath === currentPath){
            a.classList.add("active");
            const parent = a.closest(".dropdown");
            if(parent) parent.classList.add("open");
        }
    });
}
loadSidebar();