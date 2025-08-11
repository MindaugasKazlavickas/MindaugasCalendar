function displayDropdown(dropdown: string) {
  const dropdownField = document.getElementById(dropdown);
  if (dropdownField) {
    dropdownField.classList.toggle("notDisplayed");
    dropdownField.focus();
  }
}
export default displayDropdown;
