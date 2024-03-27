class MultiSelectDropdown {
  constructor(options) {
    this.config = {
      search: true,
      hideX: false,
      useStyles: true,
      placeholder: 'Select...',
      txtSelected: 'Selected',
      txtAll: 'All',
      txtRemove: 'Remove',
      txtSearch: 'Search...',
      minWidth: '160px',
      maxWidth: '360px',
      maxHeight: '180px',
      borderRadius: 6,
      ...options
    };

    this.init();
  }

  init() {
    document.querySelectorAll('select[multiple]').forEach((multiSelect) => {
      const wrapper = this.createWrapper(multiSelect);
      const searchInput = this.createSearchInput(multiSelect);
      const dropdownList = this.createDropdownList(multiSelect);
      const selectedContainer = document.getElementById('dropdownSelected'); // Get the container for selected options

      wrapper.appendChild(searchInput);
      wrapper.appendChild(dropdownList);
      this.setupEventListeners(multiSelect, searchInput, dropdownList, selectedContainer); // Pass the selectedContainer to setupEventListeners

      if (this.config.useStyles) {
        this.injectStyles();
      }
    });
  }

  createWrapper(multiSelect) {
    const wrapper = document.createElement('div');
    wrapper.className = 'multiselect-dropdown';
    multiSelect.style.display = 'none';
    multiSelect.parentNode.insertBefore(wrapper, multiSelect.nextSibling);
    return wrapper;
  }

  createSearchInput(multiSelect) {
    const searchInput = document.createElement('input');
    searchInput.className = 'multiselect-dropdown-search';
    searchInput.placeholder = this.config.txtSearch;
    searchInput.style.display = this.config.search ? 'block' : 'none';
    return searchInput;
  }

  createDropdownList(multiSelect) {
    const dropdownList = document.createElement('div');
    dropdownList.className = 'multiselect-dropdown-list';
    dropdownList.style.maxHeight = this.config.maxHeight;
    const selectedContainer = document.getElementById('dropdownSelected'); // Ensure selectedContainer is defined
    this.populateOptions(multiSelect, dropdownList, selectedContainer); // Pass selectedContainer here
    return dropdownList;
  }

  populateOptions(multiSelect, dropdownList, selectedContainer) {
    Array.from(multiSelect.options).forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.className = option.selected ? 'checked' : '';
      optionElement.innerText = option.text;
      optionElement.addEventListener('click', () => {
        option.selected = !option.selected;
        optionElement.classList.toggle('checked');
        multiSelect.dispatchEvent(new Event('change'));
        this.updateSelectedOptions(multiSelect, selectedContainer); // Update the selected options container
      });
      dropdownList.appendChild(optionElement);
    });
    this.updateSelectedOptions(multiSelect, selectedContainer); // Initial update for pre-selected options
  }

  setupEventListeners(multiSelect, searchInput, dropdownList, selectedContainer) { // Include selectedContainer here if needed
    // Show dropdown list when the search input is focused
    searchInput.addEventListener('focus', () => {
      dropdownList.style.display = 'block'; // Show the dropdown list
    });

    // Hide dropdown list when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownList.contains(e.target) && !searchInput.contains(e.target)) {
        dropdownList.style.display = 'none'; // Hide the dropdown list
      }
    });

    // Filter options based on search input
    searchInput.addEventListener('input', () => {
      const searchText = searchInput.value.toLowerCase();
      Array.from(dropdownList.children).forEach((optionElement) => {
        const matches = optionElement.innerText.toLowerCase().includes(searchText);
        optionElement.style.display = matches ? 'block' : 'none';
      });
      // Show the dropdown list when searching
      dropdownList.style.display = 'block';
    });
  }
  updateSelectedOptions(multiSelect, selectedContainer) {
    selectedContainer.innerHTML = ''; // Clear the container
    Array.from(multiSelect.selectedOptions).forEach((option) => {
      const selectedOptionElement = document.createElement('span');
      selectedOptionElement.innerText = option.text;
      const removeBtn = document.createElement('button');
      removeBtn.innerText = 'X';
      removeBtn.onclick = () => {
        option.selected = false;
        multiSelect.dispatchEvent(new Event('change'));
        this.updateSelectedOptions(multiSelect, selectedContainer); // Update the container after removal
      };
      selectedOptionElement.appendChild(removeBtn);
      selectedContainer.appendChild(selectedOptionElement);
    });
  }
  injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .multiselect-dropdown {
        min-width: ${this.config.minWidth};
        max-width: ${this.config.maxWidth};
        border-radius: ${this.config.borderRadius}px;
      }
      .multiselect-dropdown-list {
        max-height: ${this.config.maxHeight};
      }
    `;
    document.head.appendChild(style);
  }
}

window.addEventListener('load', () => {
  new MultiSelectDropdown(window.MultiSelectDropdownOptions);
});
