async function loadSidebar(){
    const res = await fetch("/partials/sidebar.html");
    const html = await res.text();
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = html;
    sidebar.querySelectorAll(".dropbtn").forEach(btn=>{
        btn.onclick=()=>btn.parentElement.classList.toggle("open");
    });
    const path = location.pathname.replace(/\/$/,"") || "/";
    sidebar.querySelectorAll("a[data-path]").forEach(a=>{
        if(a.dataset.path === path){
            a.classList.add("active");
            const parent=a.closest(".dropdown");
            if(parent) parent.classList.add("open");
        }
    });
}
loadSidebar();