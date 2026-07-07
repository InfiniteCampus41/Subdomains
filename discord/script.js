const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
const particles = [];
for (let i = 0; i < 75; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.8,
        size: 1.5 + Math.random() * 2.5
    });
}
function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
        p.y += p.speed;
        if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#63d97e";
        ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );
                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );
                ctx.strokeStyle =
                    `rgba(99,217,126,${1 - dist / 140})`;

                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateBackground);
}
animateBackground();
const inviteUrl = "https://discord.gg/Fq2gUZvRr3";
const inviteCode = inviteUrl
    .replace("https://discord.gg/", "")
    .replace("https://discord.com/invite/", "");
fetch(
    `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`
)
.then(r => r.json())
.then(data => {
    const guild = data.guild;
    document.getElementById("name").textContent =
        guild?.name || "Unknown Server";
    document.getElementById("description").textContent =
        guild?.description || "No Description Available.";
    document.getElementById("members").textContent =
        data.approximate_member_count ?? "-";
    document.getElementById("online").textContent =
        data.approximate_presence_count ?? "-";
    document.getElementById("join").href = inviteUrl;
    let iconUrl;
    if (guild?.icon) {
        iconUrl =
            `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=512`;
        document.getElementById("icon").src = iconUrl;
    } else {
        iconUrl =
            "https://cdn.discordapp.com/embed/avatars/0.png";
        document.getElementById("icon").src = iconUrl;
    }
    document.title = `Join The ${guild?.name || "Discord"} Server`;
    document
        .querySelector('meta[property="og:title"]')
        ?.setAttribute("content", guild?.name || "Discord");
    document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute(
            "content",
            guild?.description || "Join This Discord Server"
        );
    document
        .querySelector('meta[property="og:image"]')
        ?.setAttribute("content", iconUrl);
    document
        .querySelector('meta[property="og:url"]')
        ?.setAttribute("content", window.location.href);
    document
        .querySelector('meta[name="twitter:title"]')
        ?.setAttribute("content", guild?.name || "Discord");
    document
        .querySelector('meta[name="twitter:description"]')
        ?.setAttribute(
            "content",
            guild?.description || "Join This Discord Server"
        );
    document
        .querySelector('meta[name="twitter:image"]')
        ?.setAttribute("content", iconUrl);
})
.catch(error => {
    console.error(error);
    document.getElementById("name").textContent =
        "Unable To Load Invite";
    document.getElementById("description").textContent =
        "The Invite May Be Invalid Or Discord Blocked The Request.";
});