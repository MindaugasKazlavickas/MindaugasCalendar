
document.addEventListener('DOMContentLoaded', () => {
    let headerButton = "calendar active";
    let currentDay = new Date().getDate();

    const calendarSideView = document.getElementById('calendarSideView');
    const weekView = document.getElementById('weekView');
    const collapseButton = document.getElementById('collapseButton');

    collapseButton.addEventListener('click', () => {
        if (headerButton === "calendar active") {
            calendarSideView.style.display = 'none';
            weekView.style.width = '100%';
            headerButton = null;
        } else {
            calendarSideView.style.display = 'inline';
            weekView.style.width = '80%';
            headerButton = "calendar active";
        }
    })
    const logoDate = document.getElementById('logoDate');
    
    logoDate.innerText = currentDay;

})