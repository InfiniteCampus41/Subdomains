const search=document.getElementById("endpointSearch");
if(search){
    search.addEventListener("input",()=>{
        const q=search.value.toLowerCase();
        const endpoints=[...document.querySelectorAll(".endpoint")];
        endpoints.forEach(sec=>{
            const text=sec.innerText.toLowerCase();
            sec.style.display=text.includes(q)?"block":"none";
        });
        const first=endpoints.find(sec=>sec.style.display!=="none");
        if(first) first.scrollIntoView({behavior:"smooth",block:"start"});
    });
}