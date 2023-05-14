const expireLimit = 31 * 24 * 60 * 60 * 1000;
const daysInMiliSecs = 1000 * 3600 * 24;
const text = document.querySelector("#text");
const createText = (label = "", data, style = "") => {
  const description = document.createElement("p");
  const content = document.createElement("span");
  description.textContent = label;
  content.textContent = data;
  const Box = document.createElement("div");
  Box.appendChild(description);
  Box.appendChild(content);
  Box.classList.add(style);
  return Box;
};

const setColor = (service, type = "service") => {
  service = service.toLowerCase();
  switch (type) {
    case "service":
      switch (service) {
        case "netflix":
          return "not-paid";
          break;
        case "website":
          return "pending";
          break;

        case "teach":
          return "warning";
          break;

        default:
          return "pending";
          break;
      }
      break;
    case "plan":
      switch (service) {
        case "mobile":
          return "paid";
          break;
        case "basic":
          return "pending";
          break;

        case "standard":
          return "warning";
          break;

        case "premium":
          return "not-paid";
          break;

        default:
          return "pending";
          break;
      }
      break;
    default:
      break;
  }
};
const Box = (service, name, paid, plans, createdAt) => {
  const Box = document.createElement("div");
  const DescriptionLabel = document.createElement("div");
  const NameLabel = document.createElement("div");
  const PayLabel = document.createElement("div");
  const DaysLabel = document.createElement("div");
  const AddedDayLabel = document.createElement("div");
  const PlanLabel = document.createElement("div");
  const StateLabel = document.createElement("div");
  const DataLabel = document.createElement("div");
  const ButtonLabel = document.createElement("div");

  const deleteBtn = document.createElement("button");
  const updateBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("btn", "delete");
  updateBtn.classList.add("btn", "update");
  updateBtn.textContent = "Update";

  const clientName = document.createElement("p");
  const clientService = document.createElement("p");
  const clientStatus = document.createElement("span");
  const clientDaysLeft = document.createElement("span");
  const clientPaidDay = document.createElement("span");
  const clientPlan = document.createElement("span");

  const nameString = document.createElement("p");
  const payString = document.createElement("p");
  const dayString = document.createElement("p");
  const startString = document.createElement("p");
  const planString = document.createElement("span");

  const paidDay = new Date(createdAt);
  const today = new Date();
  const expireDay = new Date(paidDay.getTime() + expireLimit);
  const daysLeft = Math.ceil(
    (expireDay.getTime() - today.getTime()) / daysInMiliSecs
  );

  const state = () => {
    if (daysLeft == 31) return "pending";
    else if (daysLeft > 20 && daysLeft < 31) return "paid";
    else if (daysLeft <= 20 && daysLeft > 10) return "warning";
    else return "not-paid";
  };
  //Data configurations
  clientName.textContent = name;
  clientService.textContent = service.toUpperCase();
  clientService.classList.add(setColor(service, "service"));
  clientStatus.textContent = String(paid).toUpperCase();
  clientStatus.classList.add(paid ? "paid" : "not-paid");
  clientDaysLeft.textContent = daysLeft;
  clientDaysLeft.classList.add(state());
  clientPaidDay.textContent = `${paidDay.getDate()}/ ${paidDay.getMonth()}/ ${paidDay.getFullYear()}`;
  clientPlan.textContent = plans.toUpperCase();
  clientPlan.classList.add(setColor(plans, "plan"));

  //Labels Configurations
  nameString.textContent = "Client:";
  NameLabel.appendChild(nameString);
  NameLabel.appendChild(clientName);
  NameLabel.classList.add("label");

  payString.textContent = "Paid:";
  PayLabel.appendChild(payString);
  PayLabel.appendChild(clientStatus);
  PayLabel.classList.add("label");

  startString.textContent = "Enrolled at:";
  DaysLabel.appendChild(startString);
  DaysLabel.appendChild(clientPaidDay);
  DaysLabel.classList.add("label");

  dayString.textContent = "Days Left:";
  AddedDayLabel.appendChild(dayString);
  AddedDayLabel.appendChild(clientDaysLeft);
  AddedDayLabel.classList.add("label");

  planString.textContent = "Plan:";
  PlanLabel.appendChild(planString);
  PlanLabel.appendChild(clientPlan);
  PlanLabel.classList.add("label");

  DataLabel.classList.add("dual-label");
  DataLabel.appendChild(DaysLabel);
  DataLabel.appendChild(AddedDayLabel);

  StateLabel.classList.add("dual-label");
  StateLabel.appendChild(PlanLabel);
  StateLabel.appendChild(PayLabel);

  DescriptionLabel.classList.add("dual-label");
  DescriptionLabel.appendChild(NameLabel);
  DescriptionLabel.appendChild(clientService);

  ButtonLabel.classList.add("dual-label");
  ButtonLabel.appendChild(updateBtn);
  ButtonLabel.appendChild(deleteBtn);

  //Boxes configurations
  Box.appendChild(DescriptionLabel);
  Box.appendChild(StateLabel);
  Box.appendChild(DataLabel);
  Box.appendChild(ButtonLabel);
  Box.classList.add("box");

  return Box;
};

const getClients = async () => {
  const res = await fetch("https://client-api-n9vu.onrender.com/api/v1", {
    method: "GET",
  });
  const Data = await res.json();
  newest.innerHTML = "";

  for (let i = 0; i < Data.data.length; i++) {
    const { service, name, paid, plans, createdAt } = Data.data[i];

    newest.appendChild(Box(service, name, paid, plans, createdAt));
  }
};

const getClient = async () => {
  try {
    const content = text.value;
    const res = await fetch(
      `https://client-api-n9vu.onrender.com/api/v1${content}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const Data = await res.json();
    console.log(Data.data);
    newest.innerHTML = "";
    for (let i = 0; i < Data.data.length; i++) {
      const { service, name, paid, plans, createdAt } = Data.data[i];

      newest.appendChild(Box(service, name, paid, plans, createdAt));
    }
  } catch (error) {
    console.log(error);
  }
};
setInterval(() => {
  if (text.value !== "") getClient();
  else getClients();
}, 1000);

async function print() {
  const newservice = {
    email: cEmail.value,
    password: cPass.value,
    phone: cNumber.value,
    service: cService.value,
    name: cName.value,
    paid: cPaid.value == "on" ? true : false,
    plans: cPlan.value,
  };
  const res = await fetch(`https://client-api-n9vu.onrender.com/api/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newservice),
  });
}
const createService = async () => {};
let showing = false;

setInterval(() => {
  if (showing === true) show();
  else hide();
});

function show() {
  form.style.display = "flex";
}
function hide() {
  form.style.display = "none";
}

function toggle() {
  showing = !showing;
}
