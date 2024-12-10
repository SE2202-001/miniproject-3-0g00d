// Job Class Definition
class Job {
    constructor(title, posted, type, level, skill, detail) {
        this.title = title;
        this.posted = new Date(posted);
        this.type = type;
        this.level = level;
        this.skill = skill;
        this.detail = detail;
    }

    // Method to format posted date
    getFormattedPostedTime() {
        return this.posted.toLocaleDateString();
    }

    // Method to get full job details
    getDetails() {
        return `
            <strong>Title:</strong> ${this.title}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skills:</strong> ${this.skill}<br>
            <strong>Details:</strong> ${this.detail}<br>
            <strong>Posted on:</strong> ${this.getFormattedPostedTime()}
        `;
    }
}

// Variables to hold the data and UI elements
let jobsData = [];
const jobListings = document.getElementById('job-listings');
const fileInput = document.getElementById('file-input');
const levelFilter = document.getElementById('level-filter');
const typeFilter = document.getElementById('type-filter');
const skillFilter = document.getElementById('skill-filter');
const sortTitle = document.getElementById('sort-title');
const sortTime = document.getElementById('sort-time');

// Load JSON Data
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                jobsData = data.map(job => new Job(job.title, job.posted, job.type, job.level, job.skill, job.detail));
                displayJobs(jobsData);
                populateFilters(jobsData);
            } catch (error) {
                alert('Error loading or parsing the JSON file.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
});

// Populate filter dropdowns based on data
function populateFilters(jobs) {
    const levels = new Set();
    const types = new Set();
    const skills = new Set();

    jobs.forEach(job => {
        levels.add(job.level);
        types.add(job.type);
        skills.add(job.skill);
    });

    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        levelFilter.appendChild(option);
    });

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });

    skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        skillFilter.appendChild(option);
    });
}

// Display job listings
function displayJobs(jobs) {
    jobListings.innerHTML = '';
    jobs.forEach(job => {
        const div = document.createElement('div');
        div.classList.add('job-item');
        div.innerHTML = `<h3>${job.title}</h3><p>${job.type} | ${job.level}</p>`;
        div.addEventListener('click', () => {
            alert(job.getDetails());
        });
        jobListings.appendChild(div);
    });
}

// Filter jobs based on selected criteria
function filterJobs() {
    let filteredJobs = jobsData;
    const selectedLevel = levelFilter.value;
    const selectedType = typeFilter.value;
    const selectedSkill = skillFilter.value;

    if (selectedLevel) filteredJobs = filteredJobs.filter(job => job.level === selectedLevel);
    if (selectedType) filteredJobs = filteredJobs.filter(job => job.type === selectedType);
    if (selectedSkill) filteredJobs = filteredJobs.filter(job => job.skill === selectedSkill);

    displayJobs(filteredJobs);
}

// Sort jobs based on selected criteria
function sortJobs() {
    let sortedJobs = [...jobsData];

    if (sortTitle.value === 'asc') {
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortTitle.value === 'desc') {
        sortedJobs.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (sortTime.value === 'asc') {
        sortedJobs.sort((a, b) => a.posted - b.posted);
    } else if (sortTime.value === 'desc') {
        sortedJobs.sort((a, b) => b.posted - a.posted);
    }

    displayJobs(sortedJobs);
}

// Add event listeners for filters and sorting
levelFilter.addEventListener('change', filterJobs);
typeFilter.addEventListener('change', filterJobs);
skillFilter.addEventListener('change', filterJobs);
sortTitle.addEventListener('change', sortJobs);
sortTime.addEventListener('change', sortJobs);
