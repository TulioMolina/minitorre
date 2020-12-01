const peopleBtn = document.getElementById("people");
const jobsBtn = document.getElementById("jobs");
const searchCriteria = document.getElementById("search-criteria");
const resultsList = document.getElementById("results");

const clearFields = () => {
  searchCriteria.innerHTML = null;
  resultsList.innerHTML = null;
};

peopleBtn.addEventListener("click", () => {
  clearFields();
  searchCriteria.innerHTML = `
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

  searchCriteria.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const locationName = document.getElementById("locationName").value;
    const professionalHeadline = document.getElementById("professionalHeadline")
      .value;
    const or = document.getElementById("or").checked;
    let logicalOperator = "and";
    if (or) {
      logicalOperator = "or";
    }

    const response = await fetch(
      `/api/people/search?logicalOperator=${logicalOperator}&size=12`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, locationName, professionalHeadline }),
      }
    );

    const data = await response.json();
    let output = "";

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

    resultsList.innerHTML = output;
  });
});

jobsBtn.addEventListener("click", () => {
  clearFields();
  searchCriteria.innerHTML = `
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

  searchCriteria.addEventListener("submit", async (event) => {
    event.preventDefault();
    const objective = document.getElementById("objective").value;
    const type = document.getElementById("type").value;
    const or = document.getElementById("or").checked;
    let logicalOperator = "and";
    if (or) {
      logicalOperator = "or";
    }

    const response = await fetch(
      `/api/opportunities/search?logicalOperator=${logicalOperator}&size=12`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objective, type }),
      }
    );

    const data = await response.json();
    let output = "";

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

    resultsList.innerHTML = output;
  });
});
