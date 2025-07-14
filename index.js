
document.addEventListener('DOMContentLoaded', () => {
    let headerButton = "calendar active";
    let currentDay = new Date();

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
    const logoDate = document.getElementById('logoText');
    
    logoDate.innerText = currentDay.getDate();
    const monthDisplay = document.getElementById('monthDisplay');
    monthDisplay.innerText = monthsLong[currentDay.getMonth()] + ", " + currentDay.getFullYear();
})

const monthsShort = [
    "Jan", "Feb", "Mar", 
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", 
    "Oct", "Nov", "Dec"];
const monthsLong = [
    "January", "February", "March", 
    "April", "May", "June",
    "July", "August", "September", 
    "October", "November", "December"];