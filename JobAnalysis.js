// Job Class Definition
class Job {
    constructor(jobNo, title, jobPageLink, posted, type, level, estimatedTime, skill, detail) {
        this.jobNo = jobNo;
        this.title = title;
        this.jobPageLink = jobPageLink;
        this.posted = posted; // Keeping it as a string for now (can be processed later)
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }

    // Method to get full job details
    getDetails() {
        return `
            <strong>Job No:</strong> ${this.jobNo}<br>
            <strong>Title:</strong> <a href="${this.jobPageLink}" target="_blank">${this.title}</a><br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Estimated Time:</strong> ${this.estimatedTime}<br>
            <strong>Skills:</strong> ${this.skill}<br>
            <strong>Details:</strong> ${this.detail}<br>
            <strong>Posted:</strong> ${this.posted}
        `;
    }
}

// Variables to hold the data and UI elements
let jobsData = [];
const jobListings = document.getElementById('job-listings');
const levelFilter = document.getElementById('level-filter');
const typeFilter = document.getElementById('type-filter');
const skillFilter = document.getElementById('skill-filter');
const sortTitle = document.getElementById('sort-title');
const sortTime = document.getElementById('sort-time');

// Load JSON Data from GitHub
const githubRawURL = 'https://raw.githubusercontent.com/SE2202-001/miniproject-3-0g00d/main/upwork_jobs.JSON';

fetch(githubRawURL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load the JSON file from GitHub.');
        }
        return response.json();
    })
    .then(data => {
        jobsData = data.map(job => new Job(
            job["Job No"],
            job["Title"],
            job["Job Page Link"],
            job["Posted"],
            job["Type"],
            job["Level"],
            job["Estimated Time"],
            job["Skill"],
            job["Detail"]
        ));
        displayJobs(jobsData);
        populateFilters(jobsData);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading or parsing the JSON file from GitHub.');
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

    // Sorting based on the "Posted" field
    if (sortTime.value === 'asc') {
        sortedJobs.sort((a, b) => {
            // Simplify the time comparison (e.g., convert "8 minutes ago" to actual minutes)
            return convertTimeToMinutes(a.posted) - convertTimeToMinutes(b.posted);
        });
    } else if (sortTime.value === 'desc') {
        sortedJobs.sort((a, b) => {
            return convertTimeToMinutes(b.posted) - convertTimeToMinutes(a.posted);
        });
    }

    displayJobs(sortedJobs);
}

// Convert "Posted" time like "8 minutes ago" into actual minutes
function convertTimeToMinutes(postedTime) {
    const regex = /(\d+)\s([a-zA-Z]+)\sago/;
    const match = postedTime.match(regex);
    if (match) {
        const quantity = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit === 'minute' || unit === 'minutes') {
            return quantity;
        } else if (unit === 'hour' || unit === 'hours') {
            return quantity * 60;
        } else if (unit === 'day' || unit === 'days') {
            return quantity * 1440; // 24 * 60
        }
    }
    return 0;
}

// Add event listeners for filters and sorting
levelFilter.addEventListener('change', filterJobs);
typeFilter.addEventListener('change', filterJobs);
skillFilter.addEventListener('change', filterJobs);
sortTitle.addEventListener('change', sortJobs);
sortTime.addEventListener('change', sortJobs);
