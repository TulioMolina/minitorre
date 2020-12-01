const peopleBtn = document.getElementById("people");
const jobsBtn = document.getElementById("jobs");
const searchCriteria = document.getElementById("search-criteria");
const resultsList = document.getElementById("results");
const nextBtn = document.getElementById("next");

let offset = 0;
let currentResource = null;
let logicalOperator = null;
let objective = null;
let type = null;
let name = null;
let locationName = null;
let professionalHeadline = null;

const clearFields = () => {
  currentResource = null;
  clearNext();
  clearSearchCriteria();
  resultsList.innerHTML = null;
};

const clearNext = () => {
  offset = 0;
  logicalOperator = null;
  objective = null;
  type = null;
  name = null;
  locationName = null;
  professionalHeadline = null;
  nextBtn.removeEventListener("click", nextEventListener);
  nextBtn.innerHTML = null;
};

const clearSearchCriteria = () => {
  searchCriteria.removeEventListener("submit", peopleEventListener);
  searchCriteria.removeEventListener("submit", jobsEventListener);
  searchCriteria.innerHTML = null;
};

peopleBtn.addEventListener("click", () => {
  clearFields();
  currentResource = "people";
  searchCriteria.innerHTML = `
        <div style="margin-bottom: 10px;">
          <h5 style="margin-bottom: 0px;">Search criteria</h5>
          <small>Fill up the fields of interest only</small>
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input class="form-control" id="name">
        </div>
        <div class="form-group">
          <label for="locationName">Location</label>
          <input class="form-control" id="locationName">
        </div>
        <div class="form-group">
          <label for="professionalHeadline">Professional Headline</label>
          <input class="form-control" id="professionalHeadline">
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="or" name="customRadioInline1" class="custom-control-input">
          <label class="custom-control-label" for="or">OR</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="and" name="customRadioInline1" class="custom-control-input">
          <label class="custom-control-label" for="and">AND</label>
        </div>
        <button type="submit" class="btn btn-primary">Search</button>
  `;

  searchCriteria.addEventListener("submit", peopleEventListener);
});

jobsBtn.addEventListener("click", () => {
  clearFields();
  currentResource = "jobs";
  searchCriteria.innerHTML = `
          <div style="margin-bottom: 10px;">
            <h5 style="margin-bottom: 0px;">Search criteria</h5>
            <small>Fill up the fields of interest only</small>
          </div>
          <div class="form-group">
            <label for="objective">Objective</label>
            <input class="form-control" id="objective">
          </div>
          <div class="form-group">
            <label for="type">Type</label>
            <input class="form-control" id="type">
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" id="or" name="customRadioInline1" class="custom-control-input">
            <label class="custom-control-label" for="or">OR</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" id="and" name="customRadioInline1" class="custom-control-input">
            <label class="custom-control-label" for="and">AND</label>
          </div>
          <button type="submit" class="btn btn-primary">Search</button>
    `;

  searchCriteria.addEventListener("submit", jobsEventListener);
});

const peopleEventListener = async (event) => {
  event.preventDefault();
  clearNext();
  resultsList.innerHTML = null;
  name = document.getElementById("name").value;
  locationName = document.getElementById("locationName").value;
  professionalHeadline = document.getElementById("professionalHeadline").value;
  const or = document.getElementById("or").checked;
  logicalOperator = "and";
  if (or) {
    logicalOperator = "or";
  }

  resultsList.innerHTML = await generatePeopleResults(
    logicalOperator,
    name,
    locationName,
    professionalHeadline
  );

  nextBtn.innerHTML = `<button type="button" class="btn btn-primary">Next</button>`;

  nextBtn.addEventListener("click", nextEventListener);
};

const jobsEventListener = async (event) => {
  event.preventDefault();
  clearNext();
  resultsList.innerHTML = null;
  objective = document.getElementById("objective").value;
  type = document.getElementById("type").value;
  const or = document.getElementById("or").checked;
  logicalOperator = "and";
  if (or) {
    logicalOperator = "or";
  }

  resultsList.innerHTML = await generateJobsResults(
    logicalOperator,
    objective,
    type
  );

  nextBtn.innerHTML = `<button type="button" class="btn btn-primary">Next</button>`;

  nextBtn.addEventListener("click", nextEventListener);
};

const nextEventListener = async () => {
  if (currentResource === "jobs") {
    resultsList.innerHTML = await generateJobsResults(
      logicalOperator,
      objective,
      type
    );
  } else {
    resultsList.innerHTML = await generatePeopleResults(
      logicalOperator,
      name,
      locationName,
      professionalHeadline
    );
  }
};

const generatePeopleResults = async (
  logicalOperator,
  name,
  locationName,
  professionalHeadline,
  size = 12
) => {
  const response = await fetch(
    `/api/people/search?logicalOperator=${logicalOperator}&size=${size}&offset=${offset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, locationName, professionalHeadline }),
    }
  );

  let output = "";

  if (response.status === 404) {
    output = `<h5>No results</h5>`;
  } else {
    const data = await response.json();
    data.result.forEach(
      ({ name, professionalHeadline, locationName, username }) => {
        output += `
          <div class="card" style="width: 18rem;">
              <div class="card-body">
                  <h5 class="card-title">${name}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${locationName}</h6>
                  <p class="card-text">${professionalHeadline}</p>
                  <a href="https://bio.torre.co/en/${username}" target="_blank" class="card-link">${username}</a>
              </div>
          </div>
        `;
      }
    );
  }

  offset += size;

  return output;
};

const generateJobsResults = async (
  logicalOperator,
  objective,
  type,
  size = 12
) => {
  const response = await fetch(
    `/api/opportunities/search?logicalOperator=${logicalOperator}&size=${size}&offset=${offset}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ objective, type }),
    }
  );

  let output = "";

  if (response.status === 404) {
    output = `<h5>No results</h5>`;
  } else {
    const data = await response.json();
    data.result.forEach(({ objective, type, id }) => {
      output += `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                  <a href="https://torre.co/jobs/${id}" target="_blank"><h5 class="card-title">${objective}</h5></a>
                  <h6 class="card-subtitle mb-2 text-muted">${type}</h6>
                </div>
            </div>
          `;
    });
  }

  offset += size;

  return output;
};
