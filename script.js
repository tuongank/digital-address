function toggleMenu() {
    const menu = document.getElementById("navMenu");
    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}
function playVideo(box) {
    box.innerHTML = `
        <video src="/images/video-keo-mo.mp4" controls autoplay style="width:100%; height:auto;"></video>`;
}
